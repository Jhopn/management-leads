import type { FastifyPluginAsync } from 'fastify';
import {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead
} from '../../controllers/lead-controller/lead-controller';
import { authAccess } from '../../middlewares/auth-middleware';
import { createLeadSchema, updateLeadSchema } from '../../controllers/lead-controller/dto/lead-dto';
import { uuidParamSchema } from '../../common/dto/param-dto';
import { paginationSchema } from '../../common/dto/pagination-dto';

const LeadRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.post('/leads', {
        schema: {
            description: 'Create a new lead',
            tags: ['Leads'],
            body: createLeadSchema,
        }
    }, createLead);

    fastify.get('/leads', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            description: 'Get a list of all leads with pagination',
            tags: ['Leads'],
            querystring: paginationSchema,
            security: [{ bearerAuth: [] }]
        }
    }, getLeads);

    fastify.get('/leads/:id', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            description: 'Get a single lead by ID',
            tags: ['Leads'],
            params: uuidParamSchema,
            security: [{ bearerAuth: [] }]
        }
    }, getLeadById);

    fastify.patch('/leads/:id', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            description: 'Update a lead by ID (partial update)',
            tags: ['Leads'],
            params: uuidParamSchema,
            body: updateLeadSchema,
            security: [{ bearerAuth: [] }]
        },
    }, updateLead);

    fastify.delete('/leads/:id', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            description: 'Delete a lead by ID',
            tags: ['Leads'],
            params: uuidParamSchema,
            security: [{ bearerAuth: [] }]
        }
    }, deleteLead);
};

export { LeadRoutes };