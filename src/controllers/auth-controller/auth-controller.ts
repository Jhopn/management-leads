import { prisma } from '../../connection/prisma';
import * as jwt from 'jsonwebtoken';
import type { FastifyRequest, FastifyReply } from 'fastify';
import * as bcrypt from 'bcryptjs';
import type z from 'zod';
import type { sessionSchema } from './dto/auth-dto';

export const authSession = async (request: FastifyRequest<{ Body: z.infer<typeof sessionSchema> }>, reply: FastifyReply) => {
  try {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userAccesses: {
          include: {
            access: true
          }
        }
      }
    });

    if (!user) {
      return reply.code(401).send({ message: 'Authentication failed, user not found.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return reply.status(401).send({ message: 'Incorrect password' });
    }

    const roles = user.userAccesses.map(ua => ua.access?.name).filter(Boolean) as string[];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: roles
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '8h',
      },
    );

    return reply.status(200).send({
      userId: user.id,
      token: token,
    });

  } catch (error) {
    console.error("Error during login:", error);
    return reply.status(401).send({
      message: 'Authentication failure.',
      success: false,
    });
  }
};