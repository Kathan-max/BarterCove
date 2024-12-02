import express from 'express';
import { UserModel } from '../models/User';

const router = express.Router();

// Create new user
router.post('/api/users', async (req, res) => {
  try {
    const { firebaseUid, email, username, pincode, phoneNumber, isPhoneVerified = false } = req.body;
    
    const user = new UserModel({
      firebaseUid,
      email,
      username,
      pincode,
      phoneNumber,
      isPhoneVerified
    });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Verify phone number
router.post('/api/users/verify-phone/:firebaseUid', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { phoneNumber } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { firebaseUid },
      { 
        phoneNumber, 
        isPhoneVerified: true 
      },
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
router.get('/api/users/getUserByUsername/:username', async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      email: user.email,
      phoneNumber: user.phoneNumber 
    });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;