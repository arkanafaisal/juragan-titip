import express from 'express'

import { rl } from '../middlewares/rate-limiter.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'
import { productController } from '../controllers/product.controller.js'


export const productRouter = express.Router()


productRouter.get('/', rl('getMyProducts'), auth, productController.get)
productRouter.post('/', rl('addProduct'), auth, productController.add)