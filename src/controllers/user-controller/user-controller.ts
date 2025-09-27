import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../connection/prisma";
import { createUserSchema, updateUserSchema } from "./dto/user-dto";
import { z } from "zod";
import * as bcrypt from 'bcryptjs';
import { exclude } from "../../util/function-exclude";
import { uuidParamSchema } from "../../common/dto/param-dto";
import { checkDomain } from "../../util/function-check-domain";
import { paginationSchema } from "../../common/dto/pagination-dto";

export const createUser = async (request: FastifyRequest<{ Body: z.infer<typeof createUserSchema> }>, reply: FastifyReply) => {
    try {
        const { name, email, password, accessRole } = request.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return reply.code(409).send({ error: "User with this email already exists." });
        }

        checkDomain(email);

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                userAccesses: {
                    create: {
                        access: {
                            connect: { name: accessRole }
                        }
                    }
                }
            }
        });

        const userResponse = exclude(user, ['password']);
        return reply.code(201).send(userResponse);

    } catch (error: any) {
        if (error.code === 'P2025') {
            return reply.code(400).send({ error: `The access role '${request.body.accessRole}' does not exist.` });
        }
        console.error("Error registering user:", error);
        return reply.code(500).send({ error: "Internal server error during registration." });
    }
};

export const getUsers = async (request: FastifyRequest<{ Querystring: z.infer<typeof paginationSchema> }>, reply: FastifyReply) => {
    const { page = 1, pageSize = 10 } = request.query;
    const offset = (page - 1) * pageSize;

    try {
        const users = await prisma.user.findMany({
            skip: offset,
            take: pageSize,
            select: {
                id: true,
                email: true,
                createdAt: true,
                userAccesses: {
                    select: {
                        access: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        const totalUsers = await prisma.user.count();

        const responseDataUsers = {
            users,
            totalPages: Math.ceil(totalUsers / pageSize)
        }

        return reply.code(200).send(responseDataUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return reply.code(500).send({ error: "Error fetching users." });
    }
};

export const updateUser = async (request: FastifyRequest<{ Body: z.infer<typeof updateUserSchema>, Params: z.infer<typeof uuidParamSchema> }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;
        const { email, password, accessRole } = request.body;

        const dataToUpdate: any = {};
        if (email) dataToUpdate.email = email;
        if (password) dataToUpdate.passwordHash = await bcrypt.hash(password, 10);

        if (accessRole) {
            const userAccess = await prisma.userAccess.findFirst({ where: { userId: id } });
            if (userAccess) {
                await prisma.userAccess.update({
                    where: { id: userAccess.id },
                    data: { access: { connect: { name: accessRole } } }
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
        });

        const userResponse = exclude(updatedUser, ['passwordHash']);
        return reply.code(200).send(userResponse);

    } catch (error: any) {
        if (error.code === 'P2025') {
            return reply.code(404).send({ error: 'User not found.' });
        }
        console.error("Error updating user:", error);
        return reply.code(500).send({ error: 'Error updating user.' });
    }
};

export const deleteUser = async (request: FastifyRequest<{ Params: z.infer<typeof uuidParamSchema> }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;

        await prisma.user.delete({ where: { id } });

        return reply.code(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return reply.code(404).send({ error: 'User not found.' });
        }
        console.error("Error deleting user:", error);
        return reply.code(500).send({ error: 'Error deleting user.' });
    }
};
