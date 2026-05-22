import { prisma } from '../libs/prisma.lib.js'
import { safePrisma } from './user.model.js'



export const productModel = {
    add: async ({ userId, name, capital, sell }: { userId: number, name: string, capital: number, sell: number }) => {
        const product = await prisma.product.create({
            data: { userId, name, capital, sell}
        })
        const { userId: z, ...clean } = product

        return clean
    },
    get: async ({ userId }: { userId: number }) => { 
        return await prisma.product.findMany({ where: { userId } }) 
    },
    del: async ({ id, userId }: { id: number, userId: number }) => {
        const product = await safePrisma(prisma.product.delete({
            where: { id, userId },
            select: { id: true }
        }))
        return !!product
    }
    
}