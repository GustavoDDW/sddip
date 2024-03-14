import Fastify from "fastify";
import cors from "@fastify/cors";
import { IpRoute } from "./routes/ipRoute";
import { GetSense } from "./routes/GetSenseRoute";



async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })
    
    await fastify.register(IpRoute);

    await fastify.register(GetSense);

    await fastify.listen({ port: 3333, host: '0.0.0.0' });
}


bootstrap();