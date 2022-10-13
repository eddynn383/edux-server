import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    avatar: {
        type: String,
        required: true,
        default: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg"
    },
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    birthDate: {
        day: {
            type: Number
        },
        month: {
            type: Number
        },
        year: {
            type: Number
        }
    },
    country: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    roles: {
        type: [String],
        default: ['Learner']
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export default mongoose.model("User", UserSchema)