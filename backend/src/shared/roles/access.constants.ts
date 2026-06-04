export const accessQueries = {
  workspace: (userId: string, id: number, roles: string[]) => ({
    where: {
      id: Number(id),
      workspaceMembers: {
        some: {
          userId,
          role: { name: { in: roles } },
        },
      },
    },
  }),

  board: (userId: string, id: number, roles: string[]) => ({
    where: {
      id: Number(id),
      workspace: {
        workspaceMembers: {
          some: {
            userId,
            role: { name: { in: roles } },
          },
        },
      },
    },
  }),

  column: (userId: string, id: number, roles: string[]) => ({
    where: {
      id: Number(id),
      board: {
        workspace: {
          workspaceMembers: {
            some: {
              userId,
              role: { name: { in: roles } },
            },
          },
        },
      },
    },
  }),

  task: (userId: string, id: number, roles: string[]) => ({
    where: {
      id: Number(id),
      column: {
        board: {
          workspace: {
            workspaceMembers: {
              some: {
                userId,
                role: { name: { in: roles } },
              },
            },
          },
        },
      },
    },
  }),
};
