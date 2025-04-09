import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWTCaptain} from '../middlewares/captainauth.middleware.js'
import { loginCaptain, logoutCaptain, registerCaptain , getProfileCaptain, getride, acceptRide, startJurny, completeRide, getHistory, sendOtp } from "../controllers/captain.controller.js";


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

CaptainRouter.route("/captain-get-ride").get(verifyJWTCaptain,getride);

CaptainRouter.route("/captain-accept-ride").get(verifyJWTCaptain,acceptRide);

CaptainRouter.route("/captain-send-otp").get(verifyJWTCaptain,sendOtp);

CaptainRouter.route("/captain-startJurny").post(verifyJWTCaptain,startJurny);

CaptainRouter.route("/captain-complete-ride").post(verifyJWTCaptain,completeRide);

CaptainRouter.route("/captain-get-history").get(verifyJWTCaptain,getHistory);



export {CaptainRouter}