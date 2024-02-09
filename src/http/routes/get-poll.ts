import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

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

            const countVotes = await redis.zrange( pollId, 0, -1, 'WITHSCORES');
            // zrange retorna um array de strings

            // O metodo reduce foi usado abaixo para converter o valor do array em um objeto do tipo string : value
            const votes = countVotes.reduce( (obj, line, index) => {
                if ( index % 2 === 0 ) {
                    const score = countVotes[ index + 1 ];
                    Object.assign( obj , { [line] : Number(score) })
                }

                return obj;
            }, {} as Record< string, number > );
            
            return response.status(200).send({
                poll: {
                    id: poll.id,
                    title: poll.title,
                    createdAt: poll.createdAt,
                    options: poll.options.map( (op) => {
                        return {
                            id: op.id,
                            title: op.title,
                            score: (op.id in votes) ? votes[op.id] : 0
                        }
                    })
                }
            });

        } catch (error) {
            console.log(error)
            return response.status(500).send({
                message: `Internal Server error`,
                error: error
            })
        }
    })
}