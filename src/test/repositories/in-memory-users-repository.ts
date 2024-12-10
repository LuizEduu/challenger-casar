import { PostsRepository } from '@/domain/feed/application/repositories/posts-repository'
import { UsersFollowersRepository } from '@/domain/feed/application/repositories/users-followers-repository'
import { UsersRepository } from '@/domain/feed/application/repositories/users-repository'
import { User } from '@/domain/feed/enterprise/entities/users'
import { UserWithFollowersAndPosts } from '@/domain/feed/enterprise/entities/value-objects/user-with-followers-and-posts'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[]

  constructor(
    private readonly usersFollowersRepository: UsersFollowersRepository,
    private readonly postsRepository: PostsRepository,
  ) {
    this.users = []
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toString() === id)

    return user ?? null
  }

  async findByIdUserWithFollowersAndPosts(
    userId: string,
  ): Promise<UserWithFollowersAndPosts | null> {
    const user = this.users.find((user) => user.id.toString() === userId)

    if (!user) {
      return null
    }

    const userFollowers = await this.usersFollowersRepository.fetchByUserId(
      user.id.toString(),
    )

    const userFolloweds =
      await this.usersFollowersRepository.fetchFollowedsByUserIdWithFollowedsInfo(
        user.id.toString(),
      )

    const userPosts = await this.postsRepository.countPostsByOwnerId(
      user.id.toString(),
    )

    const followedsIds = userFolloweds.map((followed) =>
      followed.followedId.toString(),
    )

    const followedsInfo = this.users
      .filter((user) => followedsIds.includes(user.id.toString()))
      .map((followed) => ({
        userId: followed.id,
        name: followed.name,
      }))

    return UserWithFollowersAndPosts.create({
      name: user.name,
      ingressedAt: user.createdAt,
      numberOfFollowers: userFollowers.length,
      numberOfFollowed: userFolloweds.length,
      numberOfPosts: userPosts,
      followedUsers: followedsInfo,
    })
  }
}