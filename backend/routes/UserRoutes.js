import express from 'express'
import { Router } from 'express'
import UserController from '../controllers/UserController.js'
import protect from '../middleware/AuthMiddleware.js';
const router = Router()

router.get("/", protect,UserController.allUser);
router.post("/signUp", UserController.userSignUp);
router.post('/login', UserController.userLogin)


export default router   