import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './workspaces/boards/task/task.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { UserModule } from './identity/users/user.module';
import { WorkspaceModule } from './workspaces/workspace/workspace.module';
import { BoardModule } from './workspaces/boards/board/board.module';
import { SharedRoleModule } from './shared/roles/role.module';
import { ColumnModule } from './workspaces/boards/column/column.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TaskModule,
    PrismaModule,
    SharedRoleModule,
    UserModule,
    BoardModule,
    WorkspaceModule,
    ColumnModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: jwtConfig,
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
