import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createPoll( app: FastifyInstance ) {
    app.post('/polls/', async (request, response) => {

        try {
            const createPollBody = z.object({
                title: z.string().min(6).max(30),
                options: z.array(z.string().min(2).max(30))
            });
        
            const { title, options } = createPollBody.parse(request.body);
        
            const poll = await prisma.poll.create({
                data: {
                    title: title,
                    options: {
                        createMany: {
                            data: options.map( op => {
                                return { title: op }
                            }),
                        }
                    }
                }
            })

            if ( !poll ) {
                throw new Error('Cannot create this poll... try again.')
            }

            return response.status(201).send({
                id: poll.id,
                title: poll.title,
                createdAt: poll.createdAt
            })

        } catch (error) {
            console.log(error)
            return response.status(500).send({
                message: `Internal Server error`,
                error: error
            })
        }
    })
}