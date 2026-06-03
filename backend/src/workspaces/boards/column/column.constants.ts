import { ColumnInclude } from 'src/generated/prisma/models';

export const columnInclude = {
  tasks: {
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      position: true,
      tags: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      creator: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  },
} satisfies ColumnInclude;
