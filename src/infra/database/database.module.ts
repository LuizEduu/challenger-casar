import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { PrismaPostsRepository } from './prisma/repositories/prisma-posts-repository'
import { UsersFollowersRepository } from '@/domain/feed/application/repositories/users-followers-repository'
import { PrismaUsersFollowersRepository } from './prisma/repositories/prisma-users-followers-repository'
import { UsersRepository } from '@/domain/feed/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { CommentsRepository } from '@/domain/feed/application/repositories/comments-repository'
import { PrismaCommentsRepository } from './prisma/repositories/prisma-comments-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
    {
      provide: UsersFollowersRepository,
      useClass: PrismaUsersFollowersRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: CommentsRepository,
      useClass: PrismaCommentsRepository,
    },
  ],
  exports: [
    PrismaService,
    PostsRepository,
    UsersFollowersRepository,
    UsersRepository,
    CommentsRepository,
  ],
})
export class DatabaseModule {}
