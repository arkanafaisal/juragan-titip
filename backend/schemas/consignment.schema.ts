import { z } from 'zod'


const id = z.number().int().positive()
const productId = z.number().int().positive()

const amount = z.number().int().positive()
const address = z.string().min(2).max(255)
const lastRestock = z.coerce.date()
const nextRestock = z.coerce.date()
const lat = z.number().min(-90).max(90)
const lng = z.number().min(-180).max(180)



export const consignmentSchema = {
    add: { body: z.object({ amount, address, lastRestock, nextRestock, lat, lng, productId }).strict() }
}





// model Consignment {
//   id        Int       @id @default(autoincrement())
//   sum       Int       @db.Integer
//   address   String    @db.VarChar(255)
//   lastRestock DateTime
//   nextRestock DateTime
//   lat       Float      
//   lng       Float      
  
//   updatedAt DateTime  @updatedAt



  
//   userId    Int       @db.Integer
//   user   User @relation(fields: [userId], references: [id])
//   productId Int
//   product   Product @relation(fields: [productId], references: [id])
// }