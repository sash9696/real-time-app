import express from "express";
import {sendMessage, getMessages} from '../controllers/messageControllers.js';
import { Auth } from "../middlewares/user.js";


const router  = express.Router();

router.post('/', Auth, sendMessage);

router.get('/:chatId', Auth, getMessages);

export default router