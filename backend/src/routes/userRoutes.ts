import express from 'express';
import { UserModel } from '../models/User';

const router = express.Router();

// Create new user
router.post('/api/users', async (req, res) => {
  try {
    const { firebaseUid, email, username, pincode } = req.body;
    
    const user = new UserModel({
      firebaseUid,
      email,
      username,
      pincode,
    });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by username
router.get('/api/users/getUserByUsername/:username', async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ email: user.email });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;