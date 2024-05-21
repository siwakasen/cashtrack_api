import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category_name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
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

export const Category = mongoose.model('Category', categorySchema);
