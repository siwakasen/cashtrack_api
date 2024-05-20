import { Schema } from "mongoose";

CategorySchema = new Schema({
    category_name: {
        type: Schema.Types.String,
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

export const Category = mongoose.model('Category', CategorySchema);
