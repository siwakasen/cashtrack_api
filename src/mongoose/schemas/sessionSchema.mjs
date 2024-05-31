import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        required: true,
    },
    sessionData: {
        type: mongoose.Schema.Types.String,
        required: true,
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

export const Session = mongoose.model('Session', sessionSchema);
