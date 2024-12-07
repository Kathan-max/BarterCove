import express from 'express';
import { ProductModel } from '../models/Products';
import { QuestionModel } from '../models/Questions';
import multer from 'multer';
import path from 'path';

const productRouter = express.Router();

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

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Get Questions by Category
productRouter.get('/questions/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await QuestionModel.find({ category });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions', error });
  }
});

// Fetch questions by category and product name
productRouter.get('/questions', async (req, res) => {
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
productRouter.post('/create', upload.single('productImage'), async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productCategory,
      productScore,
      productOwner,
      postalCode,
    } = req.body;

    // Validate required fields
    if (!productName || !productDescription || !productCategory || !productOwner) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new product
    const newProduct = new ProductModel({
      productName,
      productDescription,
      productCategory,
      productScore: Number(productScore),
      productOwner,
      postalCode: postalCode || 'N/A',
      imagePath: req.file ? req.file.path : '',
      totalBids: 0,
      productStatus: 'unsold',
      barterOptions: [],
    });

    // Save product to database
    const savedProduct = await newProduct.save();

    // Send only necessary data back to the client
    res.status(201).json({
      _id: savedProduct._id,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
});

productRouter.get('questions/getProductsByCategory/:category', async (req, res) => {
  try {
    // const { category } = req.params; // Use the actual category from the route
    const category = "Furniture";
    console.log("in the api call");
    const questions = await QuestionModel.find({category: category });
    const productNames = [
      ...new Set(questions.map((question) => question.productName))
    ];
    res.status(200).json(productNames);
  } catch (error) {
    console.error('Error fetching products from questions collection:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

export default productRouter;
