import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { FetchRecentsFollowedPostsRequest } from '../dto/fetch-recents-followed-posts-request'
import { FetchRecentsFollowedPostsResponse } from '../dto/fetch-recents-followed-posts-response'
import { PostsRepository } from '../repositories/posts-repository'
import { left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UsersFollowersRepository } from '../repositories/users-followers-repository'

export class FetchRecentsFollowedPostsUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersFollowedRepository: UsersFollowersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute({
    userId,
    page,
  }: FetchRecentsFollowedPostsRequest): Promise<FetchRecentsFollowedPostsResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const followingUsers = await this.usersFollowedRepository.fetchByUserId(
      user.id.toString(),
    )

    const followingUsersIds = followingUsers.map((f) => f.followedId.toString())

    const posts = await this.postsRepository.fetchByUsersIds(
      followingUsersIds,
      {
        page,
      },
    )

    return right(posts)
  }
}
