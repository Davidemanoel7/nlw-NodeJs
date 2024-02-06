import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createPoll( app: FastifyInstance ) {
    app.post('/polls/', (request, response) => {
        const createPollBody = z.object({
            title: z.string().min(6).max(30),
            options: z.array(z.string().min(2).max(30))
        });
    
        const { title, options } = createPollBody.parse(request.body);
    
        prisma.poll.create({
            data: {
                title: title
            }
        })
        .then( result => {
            console.log(result);
            return response.status(201).send({
                id: result.id,
                title: result.title,
                createdAt: result.createdAt
            })
        })
        .catch( err => {
            console.log(err);
            return response.status(500).send({
                message: `Internal Server error`,
                error: err
            })
        })
    })
}