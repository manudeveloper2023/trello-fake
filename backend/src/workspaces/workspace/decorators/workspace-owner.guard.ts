import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class WorkspaceOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const userId = req.user.id;
    const workspaceId = Number(req.params.workspaceId);

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('You are not the owner');
    }

    return true;
  }
}
