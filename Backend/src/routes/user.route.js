import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {getcaptaindata, getOtp, getProfile, getrideinfo, loginUser, logoutUser, registerUser} from "../controllers/user.controller.js"
import { verifyJWTUser } from "../middlewares/userauth.middleware.js";
import { createRide, deleteRide } from "../controllers/ride.controller.js";

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
export {UserRouter}