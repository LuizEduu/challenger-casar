import { Injectable } from '@nestjs/common'
import { FetchRecentPostsRequest } from '../dto/fetch-recents-posts-request'
import { FetchRecentsPostsResponse } from '../dto/fetch-recents-posts-response'
import { PostsRepository } from '../repositories/posts-repository'
import { right } from '@/core/either'

@Injectable()
export class FetchRecentPostsUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    page,
  }: FetchRecentPostsRequest): Promise<FetchRecentsPostsResponse> {
    const posts = await this.postsRepository.fetchRecentsPosts({
      page,
    })

    return right(posts)
  }
}
