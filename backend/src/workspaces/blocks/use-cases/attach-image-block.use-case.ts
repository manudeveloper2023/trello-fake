import { Inject } from '@nestjs/common';
import { FileUploadDTO } from 'src/shared/storage/dtos/file-upload.dto';
import type { StorageServiceInterface } from 'src/shared/storage/storage.interface';
import { StorageTokens } from 'src/shared/storage/storage.tokens';
import { BlockTokens } from '../block.tokens';
import type { BlockRepositoryInterface } from '../repositories/block.repository';
import { CreateBlockDTO } from '../dtos/create-block.dto';
import { BlockType } from 'src/generated/prisma/browser';
import { BlockPositionService } from '../services/block-position.service';
import { AttachBlockDTO } from '../dtos/attach-block.dto';
import { ReadBlockDTO } from '../dtos/read-block.dto';
import { BlockMapper } from '../mappers/block.mapper';

export type ImageUrl = string;

export interface AttachImageBlockUseCaseInterface {
  execute(
    taskId: number,
    body: AttachBlockDTO,
    file: Express.Multer.File,
  ): Promise<ReadBlockDTO>;
}

export class AttachImageBlockUseCase implements AttachImageBlockUseCaseInterface {
  constructor(
    @Inject(StorageTokens.StorageService)
    private readonly storageService: StorageServiceInterface,
    @Inject(BlockTokens.BlockPositionService)
    private readonly blockPositionService: BlockPositionService,
    @Inject(BlockTokens.BlockRepository)
    private readonly blockRepository: BlockRepositoryInterface,
  ) {}

  async execute(
    taskId: number,
    body: AttachBlockDTO,
    file: Express.Multer.File,
  ): Promise<ReadBlockDTO> {
    const imageUrl = await this.storageService.uploadFile(
      file,
      `tasks/${taskId}/blocks`,
    );

    const createBlock: CreateBlockDTO = {
      type: BlockType.IMAGE,
      content: imageUrl,
    };

    const { beforeBlockId, afterBlockId } = body;
    const newPosition = await this.blockPositionService.calculateCreatePosition(
      taskId,
      {
        beforeBlockId,
        afterBlockId,
      },
    );

    const block = await this.blockRepository.createBlock(
      taskId,
      createBlock,
      newPosition,
    );

    const readBlockDTO: ReadBlockDTO = BlockMapper.toDTO(block);

    return readBlockDTO;
  }
}
