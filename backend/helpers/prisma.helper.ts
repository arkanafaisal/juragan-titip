
import { Prisma } from '@prisma/client'

export const safePrisma = async <T>(notFound: true | null, fk: true | null, prismaPromise: Promise<T>) => {
    try {
        return { ok: true, data: await prismaPromise  }
    } catch (err) {
        const messages: string[] = []
        if (notFound && err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025'){ messages.push('not_found')}
        if(fk && err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003'){ messages.push('Foreign_key_constraint_failed') }
        if(messages.length === 0){throw err}
        
        if(messages.length === 1){return null}
        return messages
    }
};


export const safeFK = async <T>(prismaPromise: Promise<T>) => {
    return await prismaPromise.catch((err)=>{
        if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003'){return null}
        throw err
    })
}

export const safeNotFound = async <T>(prismaPromise: Promise<T>) => {
    return await prismaPromise.catch((err)=>{
        if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025'){return null}
        throw err
    })
}