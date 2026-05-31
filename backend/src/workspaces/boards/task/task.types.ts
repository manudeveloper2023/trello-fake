import { TaskGetPayload } from 'src/generated/prisma/internal/prismaNamespaceBrowser';
import { taskInclude } from './task.constants';

export type TaskWithRelations = TaskGetPayload<{
  include: typeof taskInclude;
}>;
