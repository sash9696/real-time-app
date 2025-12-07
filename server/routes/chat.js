import express from "express";
import {accessChats,fetchAllChats,createGroup,renameGroup,addToGroup,removeFromGroup } from "../controllers/chatControllers.js";
import { Auth } from "../middlewares/user.js";


const router = express.Router();


router.post('/', Auth, accessChats)
router.get('/', Auth, fetchAllChats)

router.post('/group',Auth, createGroup)


router.patch('/group/rename',Auth, renameGroup)
router.patch('/groupAdd',Auth, addToGroup)
router.patch('/groupRemove',Auth, removeFromGroup)

// router.delete('/removeUser', Auth)

export default router;