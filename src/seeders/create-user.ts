import { prisma } from '../connection/prisma';
import * as bcrypt from 'bcryptjs';

async function createDefaultAdmin() {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "secret";

    try {
        const AdminRole = await prisma.access.findUnique({
            where: { name: 'ADMIN' },
        });

        if (!AdminRole) {
            console.error("Erro: A role 'Admin' não foi encontrada. Execute o seeder de roles primeiro.");
            return;
        }

        const existingAdmin = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (existingAdmin) {
            console.warn(`Usuário Admin com o e-mail '${ADMIN_EMAIL}' já existe.`);
            return;
        }

        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

        await prisma.user.create({
            data: {
                name: 'Admin User',
                email: ADMIN_EMAIL,
                password: passwordHash,
                userAccesses: {
                    create: {
                        accessId: AdminRole.id, 
                    },
                },
            },
        });

        console.log(`Usuário Admin '${ADMIN_EMAIL}' criado com sucesso!`);

    } catch (error) {
        console.error('Erro ao criar o usuário Admin padrão:', error);
    } finally {
        await prisma.$disconnect();
    }
}

void createDefaultAdmin();