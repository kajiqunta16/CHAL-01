const bcrypt = require('bcryptjs');
const userModel = require('../models/user-model');
// User registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new userModel({
            username,
            email,
            password: passwordHash
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await userModel.findByIdAndUpdate(req.params.userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Delete user account
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Change user password
exports.changeUserPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.params.userId);
        if (!user || !(await user.comparePassword(oldPassword))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
