import connectDB from './database/db.js';
import dotenv from 'dotenv';
import express from 'express'

const app = express()

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 8000;


connectDB()
// .then(() => {
//     app.on("error", function(error) {
//         console.log(`Server listening error :: ${error}`);
//         throw error
//     });
// })
// .catch((error) => {
//     console.log(`Server connection error :: ${error}`);
//     throw
// })

app.listen(PORT, () => {
    console.log(`Server is runing successfully in PORT ${process.env.PORT}`)
});