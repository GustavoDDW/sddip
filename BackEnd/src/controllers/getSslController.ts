import fs from 'fs';
import tls from 'tls';
import { FastifyInstance } from 'fastify';
import pLimit from 'p-limit';

interface Site {
    dominio: string;
}

// Função para obter a data de expiração do certificado SSL de um domínio
const getSSLExpirationDate = (hostname: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const options = {
            host: hostname,
            port: 443,
            rejectUnauthorized: false,
            servername: hostname,
        };

        const tlsSocket = tls.connect(options, () => {
            const certificate = tlsSocket.getPeerCertificate();
            if (certificate && certificate.valid_to) {
                resolve(certificate.valid_to);
            } else {
                reject('Certificado não encontrado');
            }
            tlsSocket.end();
        });

        tlsSocket.on('error', () => {
            reject('Falha na conexão');
        });

        tlsSocket.setTimeout(5000); // Timeout opcional de 5 segundos
        tlsSocket.on('timeout', () => {
            reject('Tempo limite atingido');
            tlsSocket.end();
        });
    });
};

// Rota para salvar as datas de expiração dos certificados SSL
export async function SslSaveRoute(fastify: FastifyInstance) {
    fastify.get('/ssl-save', async (request, reply) => {
        try {
            // Lê o arquivo dataSense.json e obtém os domínios
            const data = fs.readFileSync('dataSense.json', 'utf8');
            const dataSense: Site[] = JSON.parse(data);

            // Limita o número de conexões simultâneas para evitar sobrecarga
            const limit = pLimit(5); // Aqui definimos um limite de 5 conexões simultâneas

            const sslResults = await Promise.all(
                dataSense.map((site) =>
                    limit(async () => {
                        try {
                            const expirationDate = await getSSLExpirationDate(site.dominio);
                            const date = new Date(expirationDate);
                            const formattedDate = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
                            return { dominio: site.dominio, sslExpiration: formattedDate };
                        } catch (error) {
                            return { dominio: site.dominio, sslExpiration: error };
                        }
                    })
                )
            );

            // Salva os resultados no arquivo ssl.json
            fs.writeFileSync('ssl.json', JSON.stringify(sslResults, null, 2));
            reply.send({ message: 'SSL expiration data saved successfully', data: sslResults });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}
