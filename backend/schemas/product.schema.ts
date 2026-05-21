import { z } from 'zod'




const id = z.number().int().positive()

const name = z.string().min(2).max(30)
const capital = z.number().positive()
const sell = z.number().positive()


export const productSchema = {
    add: { body: z.object({ name, capital, sell }).strict() },

}