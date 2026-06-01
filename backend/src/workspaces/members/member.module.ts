import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberTokens } from './member.tokens';
import { MemberController } from './member.controller';
import { RoleModule } from './roles/role.module';
import { MemberRepository } from './repositories/member.repository';

@Module({
  imports: [RoleModule],
  providers: [
    {
      provide: MemberTokens.MemberService,
      useClass: MemberService,
    },
    {
      provide: MemberTokens.MemberRepository,
      useClass: MemberRepository,
    },
  ],
  controllers: [MemberController],
  exports: [MemberTokens.MemberService, MemberTokens.MemberRepository],
})
export class MemberModule {}
