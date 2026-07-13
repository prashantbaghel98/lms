import mongoose from "mongoose";

// Connect to DB 

const connectDB = async()=>{
    mongoose.connection.on('connected', ()=> console.log('DB Connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB