const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: false, // userId is optional as some categories might be predefined/global
        index: true // Add index for efficient querying
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Compound unique index: a user cannot have two categories with the same name.
// Also allows for global categories (userId: null) to have unique names among themselves,
// and different users to have categories with the same name.
CategorySchema.index({ name: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });
// For global categories, ensure unique name when userId is null/undefined
CategorySchema.index({ name: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: false } } });

module.exports = mongoose.model('Category', CategorySchema);
