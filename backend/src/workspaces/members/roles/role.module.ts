import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { WorkspacesTokens } from 'src/workspaces/workspaces.tokens';

@Module({
  providers: [
    {
      provide: WorkspacesTokens.MemberRoleService,
      useClass: RoleService,
    },
  ],
  controllers: [],
  exports: [WorkspacesTokens.MemberRoleService],
})
export class RoleModule {}
