import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getPoll( app: FastifyInstance ) {
    app.get('/polls/:pollId', async (request, response) => {

        try {
            const getPollParam = z.object({
                pollId: z.string().uuid(),
            });
        
            const { pollId } = getPollParam.parse(request.params);
        
            const poll = await prisma.poll.findUnique({
                where: {
                    id: pollId
                },
                include: {
                    options: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            })

            if ( !poll ) {
                return response.status(404).send({
                    message: `Poll with id ${pollId} not found`
                })
            }

            return response.status(201).send({
                id: poll.id,
                title: poll.title,
                updatedAt: poll.updatedAt
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