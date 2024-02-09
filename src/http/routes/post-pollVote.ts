import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { redis } from "../../lib/redis";
import { voting } from "../../utils/vote-pub-sub";

export async function voteOnPoll( app: FastifyInstance ) {
    app.post('/polls/:pollId/votes/', async (request, response) => {

        try {
            const voteOnPollBody = z.object({
                pollOptionId: z.string().uuid()
            });

            const voteOnPollParams = z.object({
                pollId: z.string().uuid()
            });
        
            // option on poll
            const { pollOptionId } = voteOnPollBody.parse(request.body);
            
            // poll
            const { pollId } = voteOnPollParams.parse(request.params);

            let { sessionId } = request.cookies

            if ( sessionId ) {
                const userPreviusVote = await prisma.vote.findUnique({
                    where: {
                        sessionId_pollId: {
                            sessionId,
                            pollId
                        }
                    }
                })

                // Caso o usuário queira votar em outra opção diferente da que ele já votou...
                if ( userPreviusVote && userPreviusVote.pollOptionId !== pollOptionId ) {
                    await prisma.vote.delete({
                        where: {
                            id: userPreviusVote.id
                        }
                    });

                    // Decrementando em -1 a opção {userPreviusVote.pollOptionId} da enquete {pollId}
                    const votes = await redis.zincrby( pollId, -1, userPreviusVote.pollOptionId );

                    voting.publish( pollId, {
                        pollOptionId: userPreviusVote.pollOptionId,
                        votes: Number(votes)
                    })


                } else if ( userPreviusVote ) {
                    return response.status(400).send({
                        message: `You already voted on this poll`
                    })
                }
            }

            // Caso não tenha nenhum cookie, é gerado um.
            if ( !sessionId ) {
                sessionId = randomUUID();
                response.setCookie('sessionId', sessionId, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 3, // 30d
                    signed:  true,
                    httpOnly: true
                });
            }

            await prisma.vote.create({
                data: {
                    sessionId,
                    pollId,
                    pollOptionId
                }
            })

            // Incrementa em 1 a opção {pollOptionId} da enquete {pollId}
            const votes = await redis.zincrby( pollId, 1, pollOptionId );

            voting.publish( pollId, {
                pollOptionId,
                votes: Number(votes)
            })

            return response.status(201).send({
                sessionId
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