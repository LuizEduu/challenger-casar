import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { PrismaPostsRepository } from './prisma/repositories/prisma-posts-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
  ],
  exports: [PrismaService, PostsRepository],
})
export class DatabaseModule {}
