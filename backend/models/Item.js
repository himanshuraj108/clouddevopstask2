const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['electronics', 'clothing', 'food', 'books', 'sports', 'other'],
            default: 'other',
        },
        images: [
            {
                url: { type: String, required: true },
                alt: { type: String, default: '' },
            },
        ],
        stock: {
            type: Number,
            default: 0,
            min: [0, 'Stock cannot be negative'],
        },
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        tags: [{ type: String, trim: true }],
        slug: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ─── Index for search ─────────────────────────────────────────────────────────
ItemSchema.index({ title: 'text', description: 'text', tags: 'text' });
ItemSchema.index({ category: 1, price: 1 });
ItemSchema.index({ createdBy: 1, createdAt: -1 });

// ─── Pre-save: Generate slug ──────────────────────────────────────────────────
ItemSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    next();
});

module.exports = mongoose.model('Item', ItemSchema);
