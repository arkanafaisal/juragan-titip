
import * as redisHelper from '../helpers/redis.helper.js'
import { consignmentModel } from "../models/consignment.model.js"
import { consignmentSchema } from '../schemas/consignment.schema.js'

import { authTypedHandler } from "../utils/handler.util.js"



export const consignmentController = {
    get: authTypedHandler<{}>(async (req, res) => {
        const cachePayload = await redisHelper.get('consignments', String(req.user.id))
        if(cachePayload.ok){res.status(200).json(cachePayload.data); return}

        const consignments = await consignmentModel.get({ userId: req.user.id })
        await redisHelper.set('consignments', String(req.user.id), consignments).catch(()=>{})

        res.status(200).json(consignments)
        return
    }),
    add: authTypedHandler<typeof consignmentSchema.add>(async (req, res) => {
        const { amount, address, lastRestock, nextRestock, lat, lng, productId } = req.validated.body

        const consignment = await consignmentModel.add({ userId: req.user.id, productId, amount, address, lastRestock, nextRestock, lat, lng })
        await redisHelper.invalidate('consignments', String(req.user.id)).catch(()=>{})

        res.status(201).json(consignment)
        return
    })
}