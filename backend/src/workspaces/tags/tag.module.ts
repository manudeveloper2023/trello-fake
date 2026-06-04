import { Module } from '@nestjs/common';
import { TagRepository } from './repositories/tag.repository';
import { TagTokens } from './tag.tokens';
import { TagService } from './tag.service';
import { TaskModule } from '../tasks/task.module';
import { TagTasksController } from './controllers/tag-tasks.controller';
import { TagController } from './controllers/tag.controller';

@Module({
  imports: [TaskModule],
  providers: [
    {
      provide: TagTokens.TagRepository,
      useClass: TagRepository,
    },
    {
      provide: TagTokens.TagService,
      useClass: TagService,
    },
  ],
  controllers: [TagController, TagTasksController],
  exports: [TagTokens.TagRepository, TagTokens.TagService],
})
export class TagModule {}
