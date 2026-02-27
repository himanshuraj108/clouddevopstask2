const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const protect = require('../middleware/auth');

// ─── GET /api/items ───────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 12, category, search, sort = '-createdAt', minPrice, maxPrice } = req.query;

        const query = { isPublished: true };
        if (category) query.category = category;
        if (search) query.$text = { $search: search };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            Item.find(query).populate('createdBy', 'name email').sort(sort).skip(skip).limit(Number(limit)),
            Item.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            count: items.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            items,
        });
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/items/:id ───────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id).populate('createdBy', 'name email avatar');
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ success: true, item });
    } catch (err) {
        next(err);
    }
});

// ─── POST /api/items ──────────────────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
    try {
        const item = await Item.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json({ success: true, item });
    } catch (err) {
        next(err);
    }
});

// ─── PUT /api/items/:id ───────────────────────────────────────────────────────
router.put('/:id', protect, async (req, res, next) => {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        if (item.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this item' });
        }

        item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, item });
    } catch (err) {
        next(err);
    }
});

// ─── DELETE /api/items/:id ────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        if (item.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this item' });
        }

        await item.deleteOne();
        res.status(200).json({ success: true, message: 'Item deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
