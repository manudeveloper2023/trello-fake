import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { UpdateBoardDTO } from './dtos/update-board.dto';

@Controller()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
}
