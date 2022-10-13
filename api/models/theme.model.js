import mongoose, { Schema } from 'mongoose';

const ThemeSchema = new Schema({
    userID: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: "light"
    },
    style: {
        type: [String],
        default: []
    }
}, { timestamps: true })

export default mongoose.model("Theme", ThemeSchema)