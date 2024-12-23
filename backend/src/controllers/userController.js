const User = require('../models/User')
const jwt = require("jsonwebtoken"); 


//generate jwt
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
};

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.statusMessage = req.body.statusMessage || user.statusMessage;

            // Check if a profile picture URL is provided
            if (req.file) {
                user.profilePicture = `/uploads/${req.file.filename}`;
            } else if (!user.profilePicture) {
                // If no profile picture exists, use the default one
                user.profilePicture = '/uploads/default.jpg';
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                statusMessage: updatedUser.statusMessage,
                profilePicture: updatedUser.profilePicture,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async(req, res) => {
    try {
        // Fetch all users except the logged-in user
        const users = await User.find({ _id: { $ne: req.user._id } }); // Assuming req.user is populated with logged-in user's info
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

module.exports = { registerUser, 
                    loginUser, 
                    getUserProfile, 
                    updateUserProfile, 
                    getAllUsers,
                  };