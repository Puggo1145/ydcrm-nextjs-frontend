import mongoose from "mongoose";

const connectToDB = async () => {
    if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
        
        throw new Error("网络错误，请稍后重试");
    }
}

export default connectToDB;