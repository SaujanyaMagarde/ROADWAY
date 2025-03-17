import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {getProfile, loginUser, logoutUser, registerUser} from "../controllers/user.controller.js"
import { verifyJWTUser } from "../middlewares/userauth.middleware.js";

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
export {UserRouter}