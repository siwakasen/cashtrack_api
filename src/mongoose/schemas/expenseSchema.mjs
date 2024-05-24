import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    expense_name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    date_of_expense: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    },
    created_at: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    },
    updated_at: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    },
});

export const Expense = mongoose.model('Expense', expenseSchema);
