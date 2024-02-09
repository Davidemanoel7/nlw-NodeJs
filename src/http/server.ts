import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { createPoll } from './routes/post-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/post-pollVote';
import websocket from '@fastify/websocket';
import { pollResults } from './webSockets/poll-results';

const app = fastify();

app.register( cookie, {
    secret: 'polls-cookie-nlw',
    hook:'onRequest'
});

app.register( websocket );

app.register( createPoll );
app.register( getPoll );
app.register( voteOnPoll );

app.register( pollResults );

app.listen({ port: 3333 })
    .then( () => {
        console.log('HTTP server running')
    });