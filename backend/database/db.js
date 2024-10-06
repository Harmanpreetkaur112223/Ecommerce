import mongoose from "mongoose";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
dotenv.config({path:"backend/config/config.env"})

const connectDb = asyncHandler(async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
        console.log(connectionInstance.connection.host);
        console.log("database connected")
    }
    catch(error){
        console.log(error.message)
        process.exit(1)
       }})
    
export default connectDb;