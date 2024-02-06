import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient({
    log: ['query'] //esse query vai mostrar a operação SQL executada quando uma requisição for enviada.
});