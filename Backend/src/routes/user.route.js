import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {registerUser} from "../controllers/user.controller.js"

const UserRouter = Router();

UserRouter.route("/user-register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),registerUser)

export {UserRouter}