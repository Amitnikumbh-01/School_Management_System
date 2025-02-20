const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    console.log('Registration attempt:', { name, email, role }); // Log registration attempt

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user without requiring class initially
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      isClassRequired: false // Class can be assigned later
    });

    if (user) {
      console.log('User created successfully:', user._id);
      res.status(201).json({
        message: 'Registration successful'
      });
    } else {
      console.log('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      console.log('Login successful:', user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log('Invalid credentials for:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Add this new function to authController.js
const assignClass = async (req, res) => {
  try {
    const { userId, classId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'student') {
      return res.status(400).json({ message: 'Only students can be assigned to classes' });
    }

    user.class = classId;
    user.isClassRequired = true;
    await user.save();

    res.json({ message: 'Class assigned successfully' });
  } catch (error) {
    console.error('Assign class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  assignClass
}; 