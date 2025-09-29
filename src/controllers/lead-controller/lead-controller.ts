import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../connection/prisma";
import { z } from "zod";
import { createLeadSchema, updateLeadSchema } from "./dto/lead-dto";
import { uuidParamSchema } from "../../common/dto/param-dto";
import { paginationSchema } from "../../common/dto/pagination-dto";
import { checkDomain } from "../../util/function-check-domain";
import { stringify } from 'csv-stringify'; 
import { Lead } from "@prisma/client";
import { PassThrough } from "stream";

export const createLead = async (request: FastifyRequest<{ Body: z.infer<typeof createLeadSchema> }>, reply: FastifyReply) => {
    try {
        const data = createLeadSchema.parse(request.body);

        await checkDomain(data.email);

        const lead = await prisma.lead.create({
            data,
        });

        return reply.code(201).send(lead);
    } catch (error) {
        console.error("Error creating lead:", error);
        return reply.code(500).send({ error: "Internal server error while creating lead." });
    }
};

export const getLeads = async (request: FastifyRequest<{ Querystring: z.infer<typeof paginationSchema> }>, reply: FastifyReply) => {
    try {
        const { page = 1, pageSize = 10 } = request.query;
        const skip = (page - 1) * pageSize;

        const [leads, totalLeads] = await prisma.$transaction([
            prisma.lead.findMany({
                skip,
                take: pageSize,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.lead.count()
        ]);

        return reply.code(200).send({
            leads,
            totalPages: Math.ceil(totalLeads / pageSize)
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return reply.code(500).send({ error: "Error fetching leads." });
    }
};

export const getLeadById = async (request: FastifyRequest<{ Params: z.infer<typeof uuidParamSchema> }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;
        const lead = await prisma.lead.findUnique({
            where: { id },
        });

        if (!lead) {
            return reply.code(404).send({ error: 'Lead not found.' });
        }

        return reply.code(200).send(lead);
    } catch (error) {
        console.error("Error fetching lead:", error);
        return reply.code(500).send({ error: "Error fetching lead." });
    }
};

export const updateLead = async (request: FastifyRequest<{ Body: z.infer<typeof updateLeadSchema>, Params: z.infer<typeof uuidParamSchema> }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;
        const data = updateLeadSchema.parse(request.body);

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: data,
        });

        return reply.code(200).send(updatedLead);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return reply.code(404).send({ error: 'Lead not found.' });
        }
        console.error("Error updating lead:", error);
        return reply.code(500).send({ error: 'Error updating lead.' });
    }
};

export const deleteLead = async (request: FastifyRequest<{ Params: z.infer<typeof uuidParamSchema> }>, reply: FastifyReply) => {
    try {
        const { id } = request.params;

        await prisma.lead.delete({ where: { id } });

        return reply.code(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return reply.code(404).send({ error: 'Lead not found.' });
        }
        console.error("Error deleting lead:", error);
        return reply.code(500).send({ error: 'Error deleting lead.' });
    }
};


export const exportLeadsToCsv = async (_: unknown, reply: FastifyReply) => {
  const passThrough = new PassThrough();

  reply.header("Content-Type", "text/csv; charset=utf-8");
  reply.header("Content-Disposition", 'attachment; filename="leads.csv"');

  reply.send(passThrough);


  const csvStringifier = stringify({
    header: true,
    columns: [
      "id", "name", "email", "telephone", "position", "message", "utm_source",
      "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid",
      "fbclid", "createdAt", "updatedAt"
    ]
  });

  passThrough.write("\uFEFF");

  csvStringifier.pipe(passThrough);

  try {
    const batchSize = 1000;
    let cursor: string | undefined = undefined;

    while (true) {
      const leads: Lead[] = await prisma.lead.findMany({
        take: batchSize,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { id: "asc" }
      });

      if (leads.length === 0) break;

      for (const lead of leads) {
        csvStringifier.write({
          id: lead.id,
          name: lead.name ?? "",
          email: lead.email ?? "",
          telephone: lead.telephone ?? "",
          position: lead.position ?? "",
          message: lead.message ?? "",
          utm_source: lead.utm_source ?? "",
          utm_medium: lead.utm_medium ?? "",
          utm_campaign: lead.utm_campaign ?? "",
          utm_term: lead.utm_term ?? "",
          utm_content: lead.utm_content ?? "",
          gclid: lead.gclid ?? "",
          fbclid: lead.fbclid ?? "",
          createdAt: lead.createdAt ? new Date(lead.createdAt).toISOString() : "",
          updatedAt: lead.updatedAt ? new Date(lead.updatedAt).toISOString() : ""
        });
      }

      cursor = String(leads[leads.length - 1].id);
    }

    csvStringifier.end();

    csvStringifier.on("error", (err) => {
      console.error("Erro no csvStringifier:", err);
      passThrough.destroy(err);
    });

    passThrough.on("error", (err) => {
      console.error("Erro no passThrough:", err);
    });

  } catch (error) {
    console.error("Error streaming leads to CSV:", error);
    csvStringifier.destroy(error as Error);
    passThrough.destroy(error as Error);
    if (!reply.sent) {
      reply.code(500).send({ error: "Internal server error while exporting leads." });
    }
  }
};