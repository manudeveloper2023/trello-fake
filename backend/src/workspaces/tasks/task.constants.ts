import { TaskInclude } from 'src/generated/prisma/models';

export const taskInclude = {
  assignedTo: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
  creator: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
  board: {
    select: {
      id: true,
      name: true,
      workspaceId: true,
    },
  },
  parentTask: {
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      position: true,
    },
  },
  column: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies TaskInclude;
