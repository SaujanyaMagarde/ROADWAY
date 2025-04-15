import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended : true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser());

import { UserRouter } from "./routes/user.route.js";
app.use("/api/v1/user",UserRouter);

import { CaptainRouter } from "./routes/captain.route.js";
app.use("/api/v1/captain",CaptainRouter);

import { MapRouter } from "./routes/map.route.js";
app.use("/api/v1/map",MapRouter);

export default app