import { BlockType } from 'src/generated/prisma/enums';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

export interface ReadBlockDTO {
  id: number;
  content: string;
  position: Decimal;
  type: BlockType;
}
