import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import http from 'http'

const app = express()
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    origin: 'roadway-885y.vercel.app',
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

export { app, server }