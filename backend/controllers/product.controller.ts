import { productSchema } from "../schemas/product.schema.js"
import { authTypedHandler } from "../utils/handler.util.js"
import { productModel } from "../models/product.model.js"
import * as redisHelper from '../helpers/redis.helper.js'


export const productController = {

    add: authTypedHandler<typeof productSchema.add>(async (req, res) => {
        const { name, capital, sell } = req.validated.body
        
        const product = await productModel.add({ userId: req.user.id, name, capital, sell })
        await redisHelper.invalidate('products', String(req.user.id)).catch(()=>{})

        res.status(201).json(product)
    }),

    get: authTypedHandler<{}>(async (req, res) => {
        const cachePayload = await redisHelper.get('products', String(req.user.id))
        if(cachePayload.ok){res.status(200).json(cachePayload.data); return}

        const products = await productModel.get({ userId: req.user.id })
        await redisHelper.set('products', String(req.user.id), products)
        res.status(200).json(products)
        return
    }),

    delete: authTypedHandler<typeof productSchema.delete>(async (req, res) => {
        const { id } = req.validated.params

        const success = await productModel.del({ id, userId: req.user.id })
        if(!success){res.sendStatus(404); return}

        await redisHelper.invalidate('products', String(req.user.id)).catch(()=>{})

        res.sendStatus(200)
        return
    })

}