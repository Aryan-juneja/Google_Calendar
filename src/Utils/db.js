import mongoose from "mongoose";

export  async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const connection =mongoose.connection
        connection.on('connected',()=>{
            console.log("mongoDb connected");
        })
        connection.on('error',(error)=>{
            console.log("mongoDb connection error",error)
            process.exit();
        })
    } catch (error) {
        console.log("something went wrong connecting to db",error)
    }
}