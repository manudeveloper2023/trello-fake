import { SetMetadata } from '@nestjs/common';

export const HIERARCHY_KEY = 'HIERARCHY_KEY';

export const CheckHierarchy = (paramKey: string) =>
  SetMetadata(HIERARCHY_KEY, paramKey);
