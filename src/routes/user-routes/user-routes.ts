import type { FastifyPluginAsync } from 'fastify';
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser
} from "../../controllers/user-controller/user-controller";
import { authAccess } from '../../middlewares/auth-middleware';
import { createUserSchemaSwagger, updateUserSchema } from '../../controllers/user-controller/dto/user-dto';
import { uuidParamSchema } from '../../common/dto/param-dto';
import { z } from 'zod';

const UserRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.post('/users', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            description: 'Create a new user (USER or ADMIN)',
            tags: ['Users'],
            body: createUserSchemaSwagger,
            security: [{ bearerAuth: [] }]
        }
    }, createUser);

    fastify.get('/users', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            description: 'Get a list of all users',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            querystring: z.object({
                page: z.coerce.number().default(1).describe('Page number'),
                pageSize: z.coerce.number().default(10).describe('Users per page')
            })
        }
    }, getUsers);

    fastify.patch('/users/:id', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            description: 'Update a user by ID',
            tags: ['Users'],
            params: uuidParamSchema,
            body: updateUserSchema,
            security: [{ bearerAuth: [] }]
        },
    }, updateUser);

    fastify.delete('/users/:id', {
        preHandler: authAccess(["ADMIN", "USER"]),
        schema: {
            description: 'Delete a user by ID',
            tags: ['Users'],
            params: uuidParamSchema,
            security: [{ bearerAuth: [] }]
        }
    }, deleteUser);
};

export { UserRoutes };