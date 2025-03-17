import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWTCaptain} from '../middlewares/captainauth.middleware.js'
import { loginCaptain, logoutCaptain, registerCaptain , getProfileCaptain } from "../controllers/captain.controller.js";


const CaptainRouter = Router();

CaptainRouter.route("/captain-register").post(
    upload.fields([
        {
            name : 'avatar',
            maxCount : 1,
        }
    ]),registerCaptain
)

CaptainRouter.route("/captain-login").post(loginCaptain)

CaptainRouter.route("/captain-logout").get(verifyJWTCaptain,logoutCaptain)

CaptainRouter.route("/captain-getProfile").get(verifyJWTCaptain,getProfileCaptain)

export {CaptainRouter}