import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { WorkspacesTokens } from '../workspaces.tokens';
import { MemberController } from './member.controller';
import { RoleModule } from './roles/role.module';

@Module({
  imports: [RoleModule],
  providers: [
    {
      provide: WorkspacesTokens.MemberService,
      useClass: MemberService,
    },
  ],
  controllers: [MemberController],
  exports: [WorkspacesTokens.MemberService],
})
export class MemberModule {}
