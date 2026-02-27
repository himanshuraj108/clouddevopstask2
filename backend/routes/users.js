const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// ─── GET /api/users (Admin only) ──────────────────────────────────────────────
router.get('/', protect, authorize('admin'), async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            users,
        });
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Users can only see themselves unless admin
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
router.put('/:id', protect, async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const allowedFields = ['name', 'avatar'];
        if (req.user.role === 'admin') allowedFields.push('role', 'isActive');

        const updateData = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
});

// ─── DELETE /api/users/:id (Admin only) ──────────────────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
