import fastify from 'fastify';

import { createPoll } from './routes/poll.routes';

const app = fastify();
app.register(createPoll);


app.listen({ port: 3333 })
    .then( () => {
        console.log('HTTP server bixo piruleta funciona hehehe!')
    });