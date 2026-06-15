import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import bcrypt from 'bcrypt';
import { WorkspaceRole } from 'src/workspaces/workspace/decorators/workspace-role.decorator';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('12345678', 10);

  await prisma.$transaction(async (tx) => {
    const [ana, bruno, carla] = await Promise.all([
      tx.user.create({
        data: {
          email: 'ana@demo.com',
          username: 'ana',
          password: passwordHash,
        },
      }),
      tx.user.create({
        data: {
          email: 'bruno@demo.com',
          username: 'bruno',
          password: passwordHash,
        },
      }),
      tx.user.create({
        data: {
          email: 'carla@demo.com',
          username: 'carla',
          password: passwordHash,
        },
      }),
    ]);

    const [ownerRole, adminRole, memberRole, viewerRole] = await Promise.all([
      tx.workspaceRole.create({
        data: {
          name: WorkspaceRole.OWNER,
          permissions: {
            manageWorkspace: true,
            manageMembers: true,
            manageBoards: true,
          },
        },
      }),
      tx.workspaceRole.create({
        data: {
          name: WorkspaceRole.ADMIN,
          permissions: {
            manageMembers: true,
            manageBoards: true,
            manageTasks: true,
          },
        },
      }),
      tx.workspaceRole.create({
        data: {
          name: WorkspaceRole.MEMBER,
          permissions: { manageTasks: true },
        },
      }),
      tx.workspaceRole.create({
        data: {
          name: WorkspaceRole.VIEWER,
          permissions: { viewOnly: true },
        },
      }),
    ]);

    const [productWorkspace, marketingWorkspace] = await Promise.all([
      tx.workspace.create({
        data: {
          name: 'Producto',
          ownerId: ana.id,
        },
      }),
      tx.workspace.create({
        data: {
          name: 'Marketing',
          ownerId: bruno.id,
        },
      }),
    ]);

    await Promise.all([
      tx.workspaceMember.create({
        data: {
          userId: ana.id,
          workspaceId: productWorkspace.id,
          roleId: ownerRole.id,
        },
      }),
      tx.workspaceMember.create({
        data: {
          userId: bruno.id,
          workspaceId: productWorkspace.id,
          roleId: adminRole.id,
        },
      }),
      tx.workspaceMember.create({
        data: {
          userId: carla.id,
          workspaceId: productWorkspace.id,
          roleId: viewerRole.id,
        },
      }),
      tx.workspaceMember.create({
        data: {
          userId: bruno.id,
          workspaceId: marketingWorkspace.id,
          roleId: ownerRole.id,
        },
      }),
      tx.workspaceMember.create({
        data: {
          userId: carla.id,
          workspaceId: marketingWorkspace.id,
          roleId: memberRole.id,
        },
      }),
    ]);

    const [productBoard, roadmapBoard, marketingBoard] = await Promise.all([
      tx.board.create({
        data: {
          name: 'Sprint Board',
          workspaceId: productWorkspace.id,
        },
      }),
      tx.board.create({
        data: {
          name: 'Roadmap',
          workspaceId: productWorkspace.id,
        },
      }),
      tx.board.create({
        data: {
          name: 'Campañas',
          workspaceId: marketingWorkspace.id,
        },
      }),
    ]);

    const [todoColumn, doingColumn, doneColumn] = await Promise.all([
      tx.column.create({
        data: {
          name: 'To do',
          boardId: productBoard.id,
        },
      }),
      tx.column.create({
        data: {
          name: 'Doing',
          boardId: productBoard.id,
        },
      }),
      tx.column.create({
        data: {
          name: 'Done',
          boardId: productBoard.id,
        },
      }),
    ]);

    const [marketingTodo, marketingDone] = await Promise.all([
      tx.column.create({
        data: {
          name: 'Pendientes',
          boardId: marketingBoard.id,
        },
      }),
      tx.column.create({
        data: {
          name: 'Publicadas',
          boardId: marketingBoard.id,
        },
      }),
    ]);

    const [bugTag, featureTag, designTag, urgentTag] = await Promise.all([
      tx.workspaceTag.create({
        data: {
          name: 'bug',
          color: '#e74c3c',
          workspaceId: productWorkspace.id,
        },
      }),
      tx.workspaceTag.create({
        data: {
          name: 'feature',
          color: '#3498db',
          workspaceId: productWorkspace.id,
        },
      }),
      tx.workspaceTag.create({
        data: {
          name: 'design',
          color: '#9b59b6',
          workspaceId: productWorkspace.id,
        },
      }),
      tx.workspaceTag.create({
        data: {
          name: 'urgent',
          color: '#e67e22',
          workspaceId: productWorkspace.id,
        },
      }),
      tx.workspaceTag.create({
        data: {
          name: 'bug',
          color: '#e74c3c',
          workspaceId: marketingWorkspace.id,
        },
      }),
      tx.workspaceTag.create({
        data: {
          name: 'feature',
          color: '#3498db',
          workspaceId: marketingWorkspace.id,
        },
      }),
      tx.workspaceTag.create({
        data: {
          name: 'design',
          color: '#9b59b6',
          workspaceId: marketingWorkspace.id,
        },
      }),
    ]);

    await Promise.all([
      tx.task.create({
        data: {
          title: 'Corregir login con refresco de token',
          description:
            'El acceso debe renovarse sin perder la sesión del usuario.',
          completed: false,
          position: 1000,
          creatorId: ana.id,
          assignedToId: bruno.id,
          columnId: todoColumn.id,
          boardId: productBoard.id,
          tags: {
            connect: [{ id: bugTag.id }, { id: urgentTag.id }],
          },
        },
      }),
      tx.task.create({
        data: {
          title: 'Definir estados vacíos del tablero',
          description:
            'Agregar placeholders claros cuando una columna no tiene tareas.',
          completed: false,
          position: 2000,
          creatorId: ana.id,
          assignedToId: carla.id,
          columnId: doingColumn.id,
          boardId: productBoard.id,
          tags: {
            connect: [{ id: featureTag.id }, { id: designTag.id }],
          },
        },
      }),
      tx.task.create({
        data: {
          title: 'Cerrar sprint de febrero',
          description:
            'Mover tareas terminadas y revisar pendientes del equipo.',
          completed: true,
          position: 3000,
          creatorId: bruno.id,
          assignedToId: ana.id,
          columnId: doneColumn.id,
          boardId: productBoard.id,
          tags: {
            connect: [{ id: featureTag.id }],
          },
        },
      }),
      tx.task.create({
        data: {
          title: 'Preparar campaña de lanzamiento',
          description:
            'Crear copies, creatividades y calendario de publicación.',
          completed: false,
          position: 1000,
          creatorId: bruno.id,
          assignedToId: carla.id,
          columnId: marketingTodo.id,
          boardId: marketingBoard.id,
          tags: {
            connect: [{ id: designTag.id }, { id: urgentTag.id }],
          },
        },
      }),
      tx.task.create({
        data: {
          title: 'Publicar anuncio principal',
          description:
            'Subir el anuncio final a las redes y monitorear resultados iniciales.',
          completed: true,
          position: 2000,
          creatorId: carla.id,
          assignedToId: null,
          columnId: marketingDone.id,
          boardId: marketingBoard.id,
          tags: {
            connect: [{ id: featureTag.id }],
          },
        },
      }),
    ]);

    await Promise.all([
      tx.block.create({
        data: {
          content: 'El login falla al intentar refrescar el token de acceso.',
          position: 1000,
          type: 'TEXT',
          taskId: 1,
        },
      }),
      tx.block.create({
        data: {
          content: 'Reproducir el error en ambiente de staging.',
          position: 2000,
          type: 'TEXT',
          taskId: 1,
        },
      }),
      tx.block.create({
        data: {
          content: 'Investigar posibles causas en el módulo de autenticación.',
          position: 3000,
          type: 'TEXT',
          taskId: 1,
        },
      }),

      tx.block.create({
        data: {
          content: 'Agregar un mensaje de error claro para el usuario.',
          position: 4000,
          type: 'TEXT',
          taskId: 1,
        },
      }),

      tx.block.create({
        data: {
          content:
            'Definir un proceso de renovación de sesión sin interrupciones.',
          position: 5000,
          type: 'TEXT',
          taskId: 1,
        },
      }),

      tx.block.create({
        data: {
          content: 'Corregir el error y desplegar la solución a producción.',
          position: 6000,
          type: 'TEXT',
          taskId: 1,
        },
      }),
    ]);
  });

  console.log('Database seeded successfully');
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
