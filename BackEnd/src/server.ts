import Fastify from "fastify";
import cors from "@fastify/cors";
import { IpRoute } from "./controllers/ipController";
import { GetSense } from "./controllers/GetSenseController";
import { userRoute } from "./controllers/userController";
import { loginRoute } from "./controllers/loginController";
import cron from 'node-cron';
import { SslSaveRoute } from "./controllers/getSslController";
import { getSslController } from "./controllers/sslController";

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })

    await fastify.register(IpRoute);

    await fastify.register(GetSense);

    await fastify.register(userRoute);

    await fastify.register(loginRoute);
    
    await fastify.register(SslSaveRoute);

    await fastify.register(getSslController);

    await fastify.listen({ port: 3333, host: '0.0.0.0' });

    // Executar a rota GetSense todos os dias às 15:05
    cron.schedule('0 9 * * *', async () => {
        try {
            await fastify.inject({
                method: 'GET',
                url: '/get-sense', // Substitua pelo caminho correto da rota GetSense
            });
            console.log('Rota get-sense executada com sucesso.');
        } catch (error) {
            console.error('Erro ao executar a rota GetSense:', error);
        }
    });


}

bootstrap();
