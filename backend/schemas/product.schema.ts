import zod from 'zod'




const id = zod.number().int().positive()
const name = zod.string().min(2).max(30)
const capital = zod.number().positive()
const sell = zod.number().positive()


export const productSchema = {
    add: { body: zod.object({ name, capital, sell }).strict() },

}