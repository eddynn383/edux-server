import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const DB = process.env.DATABASE_URI

const connectDB = async () => {
    try {
        await mongoose.connect(DB)
    } catch (err) {
        console.log(err)
    }
}

export default connectDB