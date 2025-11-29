import express from "express";
import { login, register } from "../controllers/userControllers.js";


const router = express.Router();


router.post('/auth/register', register)
router.post('/auth/login', login)
// router.post('/auth/logout', logout)


export default router;