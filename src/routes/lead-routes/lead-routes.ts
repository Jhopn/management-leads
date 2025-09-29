import type { FastifyPluginAsync } from 'fastify';
import {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    exportLeadsToCsv
} from '../../controllers/lead-controller/lead-controller';
import { authAccess } from '../../middlewares/auth-middleware';
import { createLeadSchema, updateLeadSchema } from '../../controllers/lead-controller/dto/lead-dto';
import { uuidParamSchema } from '../../common/dto/param-dto';
import { paginationSchema } from '../../common/dto/pagination-dto';

const LeadRoutes: FastifyPluginAsync = async (fastify) => {

    fastify.post('/leads', {
        schema: {
            summary: 'Create a new lead',
            description: 'Create a new lead',
            tags: ['Leads'],
            body: createLeadSchema,
        }
    }, createLead);

    fastify.get('/leads', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            summary: 'List all leads with pagination',
            description: 'Get a list of all leads with pagination',
            tags: ['Leads'],
            querystring: paginationSchema,
            security: [{ bearerAuth: [] }]
        }
    }, getLeads);

    fastify.get('/leads/:id', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            summary: 'Get a single lead by ID',
            description: 'Get a single lead by ID',
            tags: ['Leads'],
            params: uuidParamSchema,
            security: [{ bearerAuth: [] }]
        }
    }, getLeadById);

    fastify.get('/leads/export-csv', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            summary: 'Export all leads to a CSV file',
            description: 'Retrieves all leads from the database and returns them as a downloadable CSV file. This route is restricted to ADMIN users.',
            tags: ['Leads'],
            security: [{ bearerAuth: [] }],
        }
    }, exportLeadsToCsv);

    fastify.patch('/leads/:id', {
        preHandler: authAccess(["ADMIN"]),
        schema: {
            summary: 'Update a lead by ID (partial update)',
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
            summary: 'Delete a lead by ID',
            description: 'Delete a lead by ID',
            tags: ['Leads'],
            params: uuidParamSchema,
            security: [{ bearerAuth: [] }]
        }
    }, deleteLead);
};

export { LeadRoutes };