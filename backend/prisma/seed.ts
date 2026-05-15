import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('12345678', 10);

  const users = [
    {
      email: 'sarah.chen@trello-fake.dev',
      username: 'sarahchen',
      password: passwordHash,
    },
    {
      email: 'mike.johnson@trello-fake.dev',
      username: 'mikejohnson',
      password: passwordHash,
    },
    {
      email: 'laura.garcia@trello-fake.dev',
      username: 'lauragarcia',
      password: passwordHash,
    },
    {
      email: 'david.lee@trello-fake.dev',
      username: 'davidlee',
      password: passwordHash,
    },
  ];

  await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {
          username: user.username,
          password: user.password,
        },
        create: user,
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
