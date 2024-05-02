import { Router } from "express";
import userController from "./userController.js";

const userRouter = new Router()

userRouter.post('/login', userController.login);
userRouter.post('/sign_up', userController.signUp);
userRouter.get('/info', userController.getInfo);

export default userRouter;