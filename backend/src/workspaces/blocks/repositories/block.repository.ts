import { Inject, Injectable } from '@nestjs/common';
import { CreateBlockDTO } from '../dtos/create-block.dto';
import { Block } from 'src/generated/prisma/browser';
import { UpdateBlockDTO } from '../dtos/update-block.dto';
import { SharedTokens } from 'src/shared/shared.tokens';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Decimal } from 'src/generated/prisma/internal/prismaNamespace';

export interface BlockRepositoryInterface {
  createBlock(
    taskId: number,
    body: CreateBlockDTO,
    newPosition: Decimal,
  ): Promise<Block>;
  deleteBlock(blockId: number): Promise<void>;
  updateBlock(blockId: number, body: UpdateBlockDTO): Promise<Block>;
  moveBlock(blockId: number, newPosition: Decimal): Promise<Block>;
  allBlocksForTask(taskId: number): Promise<Block[]>;
  getBlockById(blockId: number): Promise<Block | null>;
  getLastBlockForTask(taskId: number): Promise<Block | null>;
}

@Injectable()
export class BlockRepository implements BlockRepositoryInterface {
  constructor(
    @Inject(SharedTokens.PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  async getLastBlockForTask(taskId: number): Promise<Block | null> {
    const block = await this.prismaService.block.findFirst({
      where: {
        taskId,
      },
      orderBy: {
        position: 'desc',
      },
    });
    return block;
  }

  async getBlockById(blockId: number): Promise<Block | null> {
    const block = await this.prismaService.block.findUnique({
      where: {
        id: blockId,
      },
    });
    return block;
  }
  async createBlock(
    taskId: number,
    body: CreateBlockDTO,
    newPosition: Decimal,
  ): Promise<Block> {
    const block = this.prismaService.block.create({
      data: {
        content: body.content ? body.content : '',
        position: newPosition,
        type: body.type,
        taskId,
      },
    });
    return block;
  }

  async deleteBlock(blockId: number): Promise<void> {
    await this.prismaService.block.delete({
      where: {
        id: blockId,
      },
    });
  }

  async updateBlock(blockId: number, body: UpdateBlockDTO): Promise<Block> {
    const block = await this.prismaService.block.update({
      where: {
        id: blockId,
      },
      data: {
        content: body.content,
        position: body.position,
        type: body.type,
      },
    });
    return block;
  }

  async moveBlock(blockId: number, newPosition: Decimal): Promise<Block> {
    const block = await this.prismaService.block.update({
      where: {
        id: blockId,
      },
      data: {
        position: newPosition,
      },
    });
    return block;
  }

  async allBlocksForTask(taskId: number): Promise<Block[]> {
    const blocks = await this.prismaService.block.findMany({
      where: {
        taskId,
      },
      orderBy: {
        position: 'asc',
      },
    });
    return blocks;
  }
}
