import { Injectable } from '@nestjs/common';
import { ReadBlockDTO } from '../dtos/read-block.dto';
import { Block } from 'src/generated/prisma/browser';

@Injectable()
export class BlockMapper {
  static toDTO(block: Block): ReadBlockDTO {
    return {
      id: block.id,
      content: block.content,
      position: block.position,
      type: block.type,
    };
  }
}
