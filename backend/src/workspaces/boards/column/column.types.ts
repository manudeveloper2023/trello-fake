import { ColumnGetPayload } from 'src/generated/prisma/models';
import { columnInclude } from './column.constants';

export type ColumnWithRelations = ColumnGetPayload<{
  include: typeof columnInclude;
}>;
