import { Module } from '@nestjs/common'
import { HealthController } from './controllers/health-check.controller'
import { CreatePostController } from './controllers/create-post.controller'
import { DatabaseModule } from '../database/database.module'
import { CreatePostUseCase } from '@/domain/feed/application/use-cases/create-post'
import { FetchRecentPostsController } from './controllers/fetch-recent-posts.controller'
import { FetchRecentPostsUseCase } from '@/domain/feed/application/use-cases/fetch-recents-posts'
import { FollowerOrUnfollowerController } from './controllers/follower-or-unfollower.controller'
import { FollowerOrUnfollowerUseCase } from '@/domain/feed/application/use-cases/follower-or-unfollower'

@Module({
  controllers: [
    HealthController,
    CreatePostController,
    FetchRecentPostsController,
    FollowerOrUnfollowerController,
  ],
  providers: [
    CreatePostUseCase,
    FetchRecentPostsUseCase,
    FollowerOrUnfollowerUseCase,
  ],
  imports: [DatabaseModule],
})
export class HttpModule {}
