import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { PostsRepository } from '../repositories/posts-repository'
import { left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { FetchPostsByOwnerIdRequest } from '../dto/fetch-posts-by-ownerId-request'
import { FetchPostsByOwnerIdResponse } from '../dto/fetch-posts-by-ownerId-response'

@Injectable()
export class FetchPostsByOwnerIdUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute({
    userId,
    page,
  }: FetchPostsByOwnerIdRequest): Promise<FetchPostsByOwnerIdResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const posts = await this.postsRepository.fetchByOnwerId(userId, {
      page,
    })

    return right(posts)
  }
}
