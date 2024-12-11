import { Module } from '@nestjs/common'
import { HealthController } from './controllers/health-check.controller'
import { CreatePostController } from './controllers/create-post.controller'
import { DatabaseModule } from '../database/database.module'
import { CreatePostUseCase } from '@/domain/feed/application/use-cases/create-post'
import { FetchRecentPostsController } from './controllers/fetch-recent-posts.controller'
import { FetchRecentPostsUseCase } from '@/domain/feed/application/use-cases/fetch-recents-posts'
import { FollowerOrUnfollowerController } from './controllers/follower-or-unfollower.controller'
import { FollowerOrUnfollowerUseCase } from '@/domain/feed/application/use-cases/follower-or-unfollower'
import { RepostController } from './controllers/repost.controller'
import { RepostUseCase } from '@/domain/feed/application/use-cases/repost'
import { FetchRecentsFollowedPostsController } from './controllers/fetch-recents-followed-posts.controller'
import { FetchRecentsFollowedPostsUseCase } from '@/domain/feed/application/use-cases/fetch-recents-followed-posts'

@Module({
  controllers: [
    HealthController,
    CreatePostController,
    FetchRecentPostsController,
    FollowerOrUnfollowerController,
    RepostController,
    FetchRecentsFollowedPostsController,
  ],
  providers: [
    CreatePostUseCase,
    FetchRecentPostsUseCase,
    FollowerOrUnfollowerUseCase,
    RepostUseCase,
    FetchRecentsFollowedPostsUseCase,
  ],
  imports: [DatabaseModule],
})
export class HttpModule {}
