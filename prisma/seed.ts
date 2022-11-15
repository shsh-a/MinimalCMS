import { PrismaClient } from '@prisma/client';

import { hashSync } from 'bcrypt';
const prisma = new PrismaClient();

const saltRounds = 10;
async function main() {
  const passwordPlain = process.env.ADMIN_SEED_PW || null;
  if (passwordPlain === null) {
    console.error('provide first admin password in .env');
    process.exit(1);
  }

  const password = hashSync(passwordPlain, saltRounds);
  await prisma.roles.create({
    data: {
      role: 'admin',
      desc: 'default admin role',
      addedBy: 'seeder',
    },
  });

  await prisma.users.create({
    data: {
      username: 'shashank',
      hash: password,
      addedBy: 'seeder',
      email: 'a@b.com',
      phone: '1234567890',
      role: 'admin',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
