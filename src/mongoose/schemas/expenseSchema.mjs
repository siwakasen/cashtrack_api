import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    amount: {
        type: Schema.Types.Number,
        required: true,
    },
    expense_name: {
        type: Schema.Types.String,
        required: true,
    },
    category_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    date_of_expense: {
        type: Schema.Types.Date,
        required: true,
    },
    created_at: {
        type: Schema.Types.Date,
        default: Date.now,
    },
    updated_at: {
        type: Schema.Types.Date,
        default: Date.now,
    },
});

export const expense = mongoose.model('Expense', expenseSchema);
