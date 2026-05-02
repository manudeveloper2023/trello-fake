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

  // =========================
  // USER 1
  // =========================
  const manu = await prisma.user.upsert({
    where: { email: 'manu@gmail.com' },
    update: {},
    create: {
      email: 'manu@gmail.com',
      username: 'manu',
      password: passwordHash,
      tasks: {
        create: [
          {
            title: 'Implement JWT authentication',
            description: 'Set up login, registration, and token-based auth',
            tags: {
              connectOrCreate: [
                { where: { name: 'backend' }, create: { name: 'backend' } },
                { where: { name: 'auth' }, create: { name: 'auth' } },
              ],
            },
          },
          {
            title: 'Design project architecture',
            description: 'Define modules, layers, and folder structure',
            tags: {
              connectOrCreate: [
                {
                  where: { name: 'architecture' },
                  create: { name: 'architecture' },
                },
                { where: { name: 'nestjs' }, create: { name: 'nestjs' } },
              ],
            },
          },
        ],
      },
    },
  });

  // =========================
  // USER 2
  // =========================
  const alice = await prisma.user.upsert({
    where: { email: 'alice@gmail.com' },
    update: {},
    create: {
      email: 'alice@gmail.com',
      username: 'alice',
      password: passwordHash,
      tasks: {
        create: [
          {
            title: 'Learn Prisma with PostgreSQL',
            description: 'Understand relations, migrations, and schema design',
            tags: {
              connectOrCreate: [
                { where: { name: 'prisma' }, create: { name: 'prisma' } },
                { where: { name: 'database' }, create: { name: 'database' } },
              ],
            },
          },
          {
            title: 'Build a tasks API',
            description: 'Create a full CRUD API using NestJS and Prisma',
            tags: {
              connectOrCreate: [
                { where: { name: 'nestjs' }, create: { name: 'nestjs' } },
                { where: { name: 'api' }, create: { name: 'api' } },
              ],
            },
          },
        ],
      },
    },
  });

  // =========================
  // USER 3
  // =========================
  const john = await prisma.user.upsert({
    where: { email: 'john.doe@gmail.com' },
    update: {},
    create: {
      email: 'john.doe@gmail.com',
      username: 'john.doe',
      password: passwordHash,
      tasks: {
        create: [
          {
            title: 'Refactor legacy codebase',
            description: 'Clean services and improve code structure',
            tags: {
              connectOrCreate: [
                { where: { name: 'refactor' }, create: { name: 'refactor' } },
                {
                  where: { name: 'clean-code' },
                  create: { name: 'clean-code' },
                },
              ],
            },
          },
          {
            title: 'Write unit tests',
            description: 'Add Jest tests for critical services',
            tags: {
              connectOrCreate: [
                { where: { name: 'testing' }, create: { name: 'testing' } },
                { where: { name: 'jest' }, create: { name: 'jest' } },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ manu, alice, john });
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
