import express from 'express';

import { rl } from '../middlewares/rate-limiter.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';
import { userController } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validator.middleware.js';



export const userRouter = express.Router();

userRouter.get('/', rl('getMyProfile'), auth, userController.getMe)

userRouter.patch('/username',    rl('updateUsername'),  auth, validate('updateUsername'),           userController.updateUsername)
userRouter.patch('/email',       rl('sendEmailVerificationLink'),  auth, validate('sendEmailVerification'),    userController.sendEmailVerification)
userRouter.patch('/password',    rl('updatePassword'),  auth, validate('updatePassword'),           userController.updatePassword)

userRouter.delete('/',            rl('deleteMyAccount'),  auth, validate('deleteUser'),               userController.delete)