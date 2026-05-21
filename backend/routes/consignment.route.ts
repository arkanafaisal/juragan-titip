import express from 'express'
import { rl } from '../middlewares/rate-limiter.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validator.middleware.js'

import { consignmentController } from '../controllers/consignment.controller.js'

export const consignmentRouter = express.Router()


consignmentRouter.get('/', rl('getMyConsignments'), auth, consignmentController.get)
