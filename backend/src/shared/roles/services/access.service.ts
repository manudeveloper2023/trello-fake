import { Inject, Injectable } from '@nestjs/common';
import { AccessTokens } from '../access.tokens';
import type {
  AccessRepositoryInterface,
  ResourceType,
} from '../repositories/access.repository';

@Injectable()
export class AccessService {
  constructor(
    @Inject(AccessTokens.AccessRepository)
    private readonly accessRepository: AccessRepositoryInterface,
  ) {}

  async hasAccess(
    resource: ResourceType,
    userId: string,
    resourceId: number,
    roles: string[],
  ) {
    return this.accessRepository.hasAccess(resource, userId, resourceId, roles);
  }
}
