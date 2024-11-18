import fs from 'fs';
import tls from 'tls';
import { FastifyInstance } from 'fastify';
import pLimit from 'p-limit';

interface Ssl {
    dominio: string;
    sslExpiration: string;
}

export async function getSslController(fastify: FastifyInstance) {
    fastify.get('/ssl', async (request, reply) => {
        try {
            
            const data = fs.readFileSync('ssl.json', 'utf-8');
            const dataSSL: Ssl[] = JSON.parse(data);

            const responsePromisses = dataSSL.map(async (Ssl: Ssl) => {
                return {
                    dominio: Ssl.dominio,
                    sslExpiration: Ssl.sslExpiration,
                }
            })

            const resultados = await Promise.all(responsePromisses);
            reply.send(resultados);
        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}
