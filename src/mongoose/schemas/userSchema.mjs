import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isLength: {
            options: {
                max: 50,
            },
            errorMessage: 'Name must be less than 50 characters',
        },
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
        notEmpty: {
            errorMessage: 'Email is required',
        },
        isEmail: {
            errorMessage: 'Invalid email',
        },
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

export const User = mongoose.model('User', userSchema);


