import { prisma } from '../libs/prisma.lib.js'



export const productModel = {
    add: async ({ userId, name, capital, sell }: { userId: number, name: string, capital: number, sell: number }) => {
        const product = await prisma.product.create({
            data: { userId, name, capital, sell}
        })

        return product
    },
    get: async ({ userId }: { userId: number }) => { 
        return await prisma.product.findMany({ where: { userId } }) 
    }
    
}