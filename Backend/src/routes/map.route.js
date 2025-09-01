import {Router} from "express";
import { verifyJWTUser } from "../middlewares/userauth.middleware.js";
import { searchRoute } from "../controllers/map.controller.js";

const MapRouter = Router();

MapRouter.route("/map-routesearch").post(verifyJWTUser,searchRoute);


export {MapRouter}