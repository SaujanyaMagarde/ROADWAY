import dotenv from "dotenv"
import connnectdb from "./db/index.js";
import app from "./app.js"

dotenv.config({
    path : "./.env"
})

connnectdb()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`listining on ${process.env.PORT} `);
    })
})
.catch((err)=>{
    console.log(err);
    throw err;
})