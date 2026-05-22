import { prisma } from '../libs/prisma.lib.js'
import { safeFK, safeNotFound } from '../helpers/prisma.helper.js'



export const productModel = {
    add: async ({ userId, name, capital, sell }: { userId: number, name: string, capital: number, sell: number }) => {
        const result = await safeFK(prisma.product.create({
            data: { userId, name, capital, sell}
        }))
        return result
    },
    get: async ({ userId }: { userId: number }) => { 
        return await prisma.product.findMany({ where: { userId } }) 
    },
    del: async ({ id, userId }: { id: number, userId: number }) => {
        const result = await safeNotFound(prisma.product.delete({
            where: { id, userId },
            select: { id: true }
        }))
        return result
    }
    
}