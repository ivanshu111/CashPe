const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01 // Ensures amount is positive
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Pre-save hook to extract month and year from the date
ExpenseSchema.pre('save', function() {
    if (this.date) {
        this.month = this.date.getMonth() + 1; // getMonth() is 0-indexed
        this.year = this.date.getFullYear();
    }
    // No next() call here, Mongoose will infer completion for synchronous hook
});

module.exports = mongoose.model('Expense', ExpenseSchema);
