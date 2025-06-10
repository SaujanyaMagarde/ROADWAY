import  mongoose from "mongoose"
import {DB_NAME} from "../constant.js";
import express from "express"

const app = express()

const connnectdb = async ()=>{
    try{
        const connnections = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n mongodb is conected || ${connnections.connection.host}`);
        
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

export default connnectdb