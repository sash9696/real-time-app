import express from "express";
import { login, register,getUserById,logout,updateInfo,validUser,searchUsers} from "../controllers/userControllers.js";
import { Auth } from "../middlewares/user.js";


const router = express.Router();


router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth/logout',Auth, logout)
router.get('/auth/valid',Auth, validUser)
router.get('/api/user', Auth, searchUsers)
router.get('/api/users/:id',Auth, getUserById)
router.patch('/api/users/update/:id', Auth, updateInfo)

export default router;