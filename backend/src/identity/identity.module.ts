import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { RoleModule } from './roles/role.module';

@Module({
  imports: [UserModule, RoleModule],
  exports: [UserModule, RoleModule],
})
export class IdentityModule {}
