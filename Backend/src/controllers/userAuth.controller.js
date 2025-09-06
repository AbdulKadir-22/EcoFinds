const User = require('../models/userAuth.model');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  // Use a long, complex secret stored in your .env file
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '7d' });
}

// --- Login user (UPDATED) ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    
    // Return username along with email and token
    res.status(200).json({ email: user.email, username: user.username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- Signup user (UPDATED) ---
const signupUser = async (req, res) => {
  // Destructure username from the request body
  const { email, password, username } = req.body;

  try {
    // Pass username to the signup method
    const user = await User.signup(email, password, username);
    const token = createToken(user._id);

    // Return username in the response
    res.status(200).json({ email: user.email, username: user.username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- Get user profile (NO MAJOR CHANGES) ---
const getProfile = async (req, res) => {
  try {
    // req.user._id is attached by the requireAuth middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// --- NEW: Update user profile ---
const updateProfile = async (req, res) => {
    const { username, profileImage } = req.body;
    const userId = req.user._id;

    try {
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the new username is already taken by another user
        if (username && username !== userToUpdate.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
            userToUpdate.username = username;
        }

        if (profileImage) {
            userToUpdate.profileImage = profileImage;
        }

        const updatedUser = await userToUpdate.save();
        
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage,
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};


module.exports = { loginUser, signupUser, getProfile, updateProfile };
