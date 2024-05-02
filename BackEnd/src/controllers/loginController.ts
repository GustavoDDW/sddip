import { FastifyInstance } from "fastify";
import db from "../services/loginService";
import Joi from "joi"; // Importe Joi
import { createLoginchema } from "../utils/schemas"; // Importe o esquema de validação Joi
import { z } from "zod";
import { generateToken } from "../helpers/userfeatures";

export async function loginRoute(fastify: FastifyInstance) {
    fastify.post('/login', {
        schema: {
            body: createLoginchema // Use o esquema de validação Joi
        }
    }, async (request, reply) => {
        const login = z.object({
            email: z.string(),
            password: z.string(),
        })

        const { email, password } = login.parse(request.body);
        const results = await db.selectLogin(email, password,);

        try {
            if (results == 0) {
                reply.status(401).send({ message: "Usuário ou senha inválido"});
            } else {
                const { email, user_name } = results[0];
                const token = generateToken(email, user_name);
                reply.status(200).send({ message: "Login efetuado com sucesso", token });
            }
        }
        catch (err) {
            reply.status(500).send({ message: `Encontramos um erro: ${err}` });
        }
    })
}