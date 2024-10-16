import mongoose from "mongoose";

const connectDb = async (url) => {
    try {
        await mongoose.connect(url, {
            dbName: "ChatPulse"
        });
        console.log("Database connected successfully")
    } catch (error) {
        console.error(error);
    }
};

export default connectDb;