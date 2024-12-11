import { Module } from '@nestjs/common'
import { HealthController } from './controllers/health-check.controller'
import { CreatePostController } from './controllers/create-post.controller'
import { DatabaseModule } from '../database/database.module'
import { CreatePostUseCase } from '@/domain/feed/application/use-cases/create-post'
import { FetchRecentPostsController } from './controllers/fetch-recent-posts.controller'
import { FetchRecentPostsUseCase } from '@/domain/feed/application/use-cases/fetch-recents-posts'

@Module({
  controllers: [
    HealthController,
    CreatePostController,
    FetchRecentPostsController,
  ],
  providers: [CreatePostUseCase, FetchRecentPostsUseCase],
  imports: [DatabaseModule],
})
export class HttpModule {}
