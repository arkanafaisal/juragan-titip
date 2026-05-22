import { prisma } from '../libs/prisma.lib.js'

import { safeFK } from '../helpers/prisma.helper.js'


export const consignmentModel = {
    get: async ({ userId }: { userId: number }) => {
        const consignments = await prisma.consignment.findMany({ where: { userId } })

        return consignments
    },
    add: async ({ userId, productId, amount, address, lastRestock, nextRestock, lat, lng }
        : { userId: number, productId: number, amount: number, address: string, lastRestock: Date, nextRestock: Date, lat: number, lng: number }) => {
            const result = await safeFK(prisma.consignment.create({
                data: { userId, productId, amount, address, lastRestock, nextRestock, lat, lng }
            }))
            return result
        }
}
