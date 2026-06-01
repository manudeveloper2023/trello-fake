import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleTokens } from './role.tokens';
import { RoleRepository } from './repositories/role.repository';

@Module({
  providers: [
    {
      provide: RoleTokens.MemberRoleService,
      useClass: RoleService,
    },
    {
      provide: RoleTokens.MemberRoleRepository,
      useClass: RoleRepository,
    },
  ],
  controllers: [],
  exports: [RoleTokens.MemberRoleService, RoleTokens.MemberRoleRepository],
})
export class RoleModule {}
