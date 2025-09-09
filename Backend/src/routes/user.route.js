import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {getcaptaindata, getOtp, getProfile, getrideinfo, loginUser, logoutUser, registerUser,gethistory} from "../controllers/user.controller.js"
import { verifyJWTUser } from "../middlewares/userauth.middleware.js";
import { createRide, deleteRide,fetchOngoingRides, getBuddy, reqbuddy, shareRide,giveride,giverequestride } from "../controllers/ride.controller.js";
import { User } from "../models/user.model.js";
const UserRouter = Router();

UserRouter.route("/user-register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),registerUser)

UserRouter.route("/user-login").post(loginUser)
UserRouter.route("/user-logout").get(verifyJWTUser,logoutUser)
UserRouter.route("/user-profile").get(verifyJWTUser,getProfile)
UserRouter.route('/user-book-ride').post(verifyJWTUser,createRide)
UserRouter.route('/user-cancel-ride').get(verifyJWTUser,deleteRide)
UserRouter.route('/user-get-otp').get(verifyJWTUser,getOtp);
UserRouter.route('/user-get-captainData').post(verifyJWTUser,getcaptaindata);
UserRouter.route('/user-getrideinfo').post(verifyJWTUser,getrideinfo);
UserRouter.route('/user-ride').get(verifyJWTUser,fetchOngoingRides);
UserRouter.route('/user-history').get(verifyJWTUser,gethistory);
UserRouter.route('/user-share-ride').post(verifyJWTUser,shareRide);
UserRouter.route('/user-find-buddy').post(verifyJWTUser,getBuddy);
UserRouter.route('/user-request-buddy').post(verifyJWTUser,reqbuddy);
UserRouter.route('/user-give-ride').get(verifyJWTUser,giveride);
UserRouter.route('/user-give-request-ride').get(verifyJWTUser,giverequestride);


export {UserRouter}