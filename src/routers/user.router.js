import { Router } from 'express'
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controllers.js'
import{ upload} from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/register").post (
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),    
    registerUser
)

router.route("/login").post(loginUser)
// secure 
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT, changeCurrentPassword)

export default router