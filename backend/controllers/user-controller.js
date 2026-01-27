const bcrypt = require('bcryptjs');
const userModel = require('../models/user-model');
// User registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmpassword } = req.body;
        const user = new userModel({ username, email, password, confirmpassword });
        if (password !== confirmpassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        user.password = passwordHash;
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json(user);
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
        res.json(user);
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
        res.json(user);
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
        const newHashedPassword = await bcrypt.hash(newPassword, 30);
        user.password = newHashedPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
