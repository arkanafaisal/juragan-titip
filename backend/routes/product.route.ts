import express from 'express'

import { rl } from '../middlewares/rate-limiter.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'
import { productController } from '../controllers/product.controller.js'
import { validate } from '../middlewares/validator.middleware.js'


export const productRouter = express.Router()


productRouter.get('/', rl('getMyProducts'), auth, productController.get)
productRouter.post('/', rl('addProduct'), auth, validate('addProduct'),  productController.add)