import { FastifyInstance } from "fastify";
import { fetchAndSaveCustomerData } from "../utils/sense";
import fs from "fs";


export async function GetSense(fastify: FastifyInstance) {
    fastify.get('/get-sense', async (request, reply) => {
        try {
            fs.unlink("dataSense.json", (err) => {
                if (err) {
                    console.error('Erro ao excluir o arquivo:', err);
                    return;
                }
                console.log('Arquivo excluído com sucesso!');
            });
            await fetchAndSaveCustomerData();
            reply.status(200).send('Arquivo salvo com sucesso!');
        } catch(err) {
            reply.status(500).send(`Ocorreu um erro: ${err}`);
        }
    })
}