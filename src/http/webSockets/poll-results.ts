import { FastifyInstance } from "fastify";
import { voting } from "../../utils/vote-pub-sub";
import z from "zod";

export async function pollResults( app: FastifyInstance ) {
    app.get('/polls/:pollId/results', { websocket: true }, ( connection, request ) => {
        connection.socket.on( 'message', ( message: string ) => {
            
            const getPollParam = z.object({
                pollId: z.string().uuid(),
            });
        
            const { pollId } = getPollParam.parse(request.params);
            
            voting.subscribe(pollId, () => {
                connection.socket.send(
                    JSON.stringify(message)
                )
            })
        })
    })
}
