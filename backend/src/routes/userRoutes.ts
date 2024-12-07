import express, { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Products';
import { QuestionModel } from '../models/Questions';
import {Products} from '../types/index';
import admin from '../firebaseAdmin';
import multer from 'multer';
import path from 'path';
import fs from 'fs'

const router = express.Router();
const upload = multer({ 
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads/products');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
// });

// Middleware to verify Firebase ID token
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Avatar paths
const avatarImages = [
  '../../../src/assets/colorful_uri.webp',
  '../../../src/assets/similing_robo.webp',
];

// Function to assign a random avatar
const assignRandomAvatar = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user || user.avatarLink) return user;

    const randomAvatar = avatarImages[Math.floor(Math.random() * avatarImages.length)];
    user.avatarLink = randomAvatar;
    await user.save();

    return user;
  } catch (error) {
    console.error('Error assigning avatar:', error);
    throw new Error('Could not assign avatar');
  }
};

// User Routes
// Create new user
router.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { firebaseUid, email, username, pincode, phoneNumber, isPhoneVerified = false } = req.body;

    const user = new UserModel({
      firebaseUid,
      email,
      username,
      pincode,
      phoneNumber,
      isPhoneVerified,
    });

    await user.save();

    // Assign random avatar after registration
    const updatedUser = await assignRandomAvatar((user._id.toString()));

    res.status(201).json({
      message: 'User created successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Verify phone number
router.post('/api/users/verify-phone/:firebaseUid', async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const { phoneNumber } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { firebaseUid },
      { phoneNumber, isPhoneVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Error verifying phone number:', error);
    res.status(500).json({ error: 'Failed to verify phone number' });
  }
});

// Get user by username
router.get('/api/users/getUserByUsername/:username', async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user location with authentication
router.patch('/api/users/:firebaseUid/location', verifyToken, async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const { latitude, longitude } = req.body;

    if ((req as any).user.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Unauthorized to update this user\'s location' });
    }

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const user = await UserModel.findOneAndUpdate(
      { firebaseUid },
      { latitude, longitude },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Location updated successfully',
      location: { latitude: user.latitude, longitude: user.longitude },
    });
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get user details
router.get('/api/users/:firebaseUid', verifyToken, async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;

    const user = await UserModel.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      avatarLink: user.avatarLink,
      firebaseUid: user.firebaseUid,
      latitude: user.latitude,
      longitude: user.longitude,
      friendIds: user.friendIds,
      totalBarters: user.totalBarters,
      totalPoints: user.totalPoints,
      itemsSold: user.itemsSold,
      itemsBought: user.itemsBought,
      unSoldItems: user.unSoldItems,
      userRatings: user.userRatings,
      pincode: user.pincode
    });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Product Routes
// Get Questions by Category
router.get('/questions/productName/:productName', async (req: Request, res: Response) => {
  try {
    const { productName } = req.params;
    const questions = await QuestionModel.find({ productName });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions', error });
  }
});

// Fetch questions by category and product name
router.get('/questions', async (req: Request, res: Response) => {
  try {
    const { category, productName } = req.query;
    const filter: any = { category };
    
    if (productName) {
      filter.productName = productName;
    }
    
    const questions = await QuestionModel.find(filter);
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions', error });
  }
});

// Create a new Product
router.post('/products/create', upload.single('productImage'), async (req, res) => {
  try {
    const { 
      productId,
      productName, 
      productDescription, 
      productCategory, 
      productScore, 
      productOwner,
      latitude,
      longitude
    } = req.body;

    // Prepare image path if file exists
    const imagePath = req.file 
      ? `/uploads/products/${req.file.filename}` 
      : '';

    // Create new product
    const newProduct = new ProductModel({
      productId,
      productName,
      productDescription,
      productCategory,
      productOwner,
      productScore: Number(productScore),
      imagePath,
      productStatus: 'unsold',
      barterOptions: [],
      latitude: Number(latitude),
      longitude: Number(longitude),
      postalCode: req.body.postalCode || '000000' // Default postal code if not provided
    });

    // Save product to database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Error creating product', error: error });
  }
});

// Get Product Names by Category from Questions
router.get('/questions/getProductsByCategory/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    // console.log("Category: ",category);
    const questions = await QuestionModel.find({ category:req.params.category});
    // console.log("Questions found:", questions);
    const productNames = [...new Set(questions.map((question) => question.productName))];
    // console.log("Product names:", productNames);
    // console.log(req.body);
    res.status(200).json(productNames);
    
  } catch (error) {
    console.error('Error fetching products from questions collection:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

router.patch('/users/unsold-items', verifyToken, async (req, res) => {
  const { userId, productUuid } = req.body; // Get userId and productUuid from the request body

  try {
    // Ensure both userId and productUuid are provided
    if (!userId || !productUuid) {
      return res.status(400).json({ message: 'userId and productUuid are required' });
    }

    // Find the user by userId and update their unsold items array
    const updatedUser = await UserModel.findOneAndUpdate(
      { firebaseUid: userId }, // Use firebaseUid to match the user
      { $push: { unSoldItems: productUuid } }, // Add productUuid to the unSoldItems array
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating unsold items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/products/nearby', async (req, res) => {
  try {
    const { excludeOwner, postalCode } = req.query;

    // Validate input
    if (!excludeOwner || !postalCode) {
      return res.status(400).json({ message: 'Owner email and postal code are required' });
    }

    // Build query to filter products
    const query = {
      productOwner: { $ne: excludeOwner }, // Exclude products by the current user
      productStatus: 'unsold', // Only fetch unsold products
      postalCode: postalCode // Match products with the same postal code
    };

    // Fetch products based on the query
    const products: Products[] = await ProductModel.find(query);
    // console.log("products:", products)

    res.json(products);
  } catch (error) {
    console.error('Error fetching nearby products:', error);
    res.status(500).json({ 
      message: 'Error fetching nearby products', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

router.post("/products/getProductsByIds", async (req, res) => {
  const { ids } = req.body;

  try {
    console.log(ids)
    const products = await ProductModel.find({productId : { $in: ids } });
    // console.log("Products: ", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
export default router;