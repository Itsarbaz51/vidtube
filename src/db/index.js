import mongoose from 'mongoose'
import express from 'express'
import { DB_NAME } from '../constants.js';


const connectDB = async () => {
    try {
        const connectedInit = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB connected !!! DB HOST ${connectedInit.connection.host}`);
    } catch (error) {
        console.log("MongoDB connecting Error",error.message);
        process.exit(1);
    }
}

export default connectDB;