import { FastifyInstance } from "fastify";
import db from "../services/userService";
import Joi from "joi"; // Importe Joi
import { createUserSchema } from "../utils/schemas"; // Importe o esquema de validação Joi
import { z } from "zod";
import { Prisma } from "@prisma/client";

export async function userRoute(fastify: FastifyInstance) {

    fastify.get('/user', async () => {
        const user = await Prisma.User.findMany()

        return { user }
    })

    fastify.post('/user', {
        schema: {
            body: createUserSchema // Use o esquema de validação Joi
        }
    }, async (request, reply) => {
        const createUser = z.object({
            userName: z.string(),
            email: z.string(),
            password: z.string(),
        })

        const { userName, email, password } = createUser.parse(request.body);

        try {
            const results = await db.findUser();
            // Iterar sobre os resultados e imprimir cada um separadamente
            results.forEach(result => {
                if (result.email == email) {
                    reply.status(400).send({ message: "Email já cadastrado" });
                }
            });

            await db.insertUser(userName, email, password);
            reply.status(201).send({ message: "Usuário cadastrado com sucesso!" });

        } catch (err) {
            reply.status(500).send({ message: `Encontramos um erro: ${err}` });
        }
    })

    fastify.put('/user', {
        schema: {
            body: createUserSchema // Use o esquema de validação Joi
        }
    }, async (request, reply) => {
        const createUser = z.object({
            idUser: z.number(),
            userName: z.string(),
            email: z.string(),
            password: z.string(),
        })

        const { idUser, userName, email, password } = createUser.parse(request.body);

        try {
            const results = await db.findUser();
            results.forEach(result => {
                if (result.user_id != idUser && result.email == email) {
                    reply.status(400).send({ message: "Email já cadastrado" });
                }
            });
            // Aqui você pode inserir os dados do usuário no banco de dados
            await db.updateUser(idUser, userName, email, password);

            reply.status(201).send({ message: "Usuário atualizado com sucesso!" });
        } catch (err) {
            reply.status(500).send({ message: `Encontramos um erro: ${err}` });
        }
    })

    fastify.delete<{ Params: { idUser: number } }>('/user/:idUser', async (request, reply) => {
        const { idUser } = request.params;
        db.deleteUser(idUser);
        try {
            await db.deleteUser(idUser);
            reply.status(204).send({ message: "Usuário deletado com sucesso!" });
        } catch (err) {
            reply.status(500).send({ message: `Encontramos um erro: ${err}` });
        }
    });
}
