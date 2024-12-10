import { Module } from '@nestjs/common'
import { HealthController } from './controllers/health-check.controller'
import { CreatePostController } from './controllers/create-post.controller'
import { DatabaseModule } from '../database/database.module'
import { CreatePostUseCase } from '@/domain/feed/application/use-cases/create-post'

@Module({
  controllers: [HealthController, CreatePostController],
  providers: [CreatePostUseCase],
  imports: [DatabaseModule],
})
export class HttpModule {}
