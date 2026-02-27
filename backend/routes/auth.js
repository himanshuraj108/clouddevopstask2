const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const protect = require('../middleware/auth');

// ─── Helper: Generate JWT ────────────────────────────────────────────────────
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: 'User already exists with this email' });

            const user = await User.create({ name, email, password });
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.profileUrl },
            });
        } catch (err) {
            next(err);
        }
    }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { email, password } = req.body;
            const user = await User.findOne({ email }).select('+password');

            if (!user || !(await user.matchPassword(password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (!user.isActive) return res.status(403).json({ error: 'Account is deactivated' });

            user.lastLogin = new Date();
            await user.save({ validateBeforeSave: false });

            const token = generateToken(user._id);

            res.status(200).json({
                success: true,
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.profileUrl },
            });
        } catch (err) {
            next(err);
        }
    }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', protect, (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
