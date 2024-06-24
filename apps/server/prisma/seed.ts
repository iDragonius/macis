import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({
    data: {
      profile: {
        create: {
          firstName: 'Emil',
          lastName: 'Hüseynov',
          phoneNumber: '+994 55 879 39 69',
        },
      },
      email: 'emilh3047@gmail.com',
      password: await bcrypt.hash('Emil@235467', 10),
      role: Role.SUPER_ADMIN,
    },
  });
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
