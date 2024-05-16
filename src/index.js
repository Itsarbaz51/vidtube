import connectDB from "./db/index.js";
import dotenv from 'dotenv';

dotenv.config({
    path: './env'
})


connectDB()
.then(() => {
    app.on((Error) => {
        console.log(`Error : `, Error);
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT ${process.env.PORT}`);
    });
})
.catch((Error) => {
    console.log(`MongoDB connection failed !!!!!!!!!`,Error);
})