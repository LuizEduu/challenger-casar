import { UsersRepository } from '@/domain/feed/application/repositories/users-repository'
import { User } from '@/domain/feed/enterprise/entities/users'
import { UserWithFollowersAndPosts } from '@/domain/feed/enterprise/entities/value-objects/user-with-followers-and-posts'
import { InMemoryUsersFollowersRepository } from './in-memory-users-followers-repository'
import { InMemoryPostsRepository } from './in-memory-posts-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[]

  constructor(
    private readonly usersFollowersRepository: InMemoryUsersFollowersRepository,
    private readonly postsRepository: InMemoryPostsRepository,
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

    const userFolloweds = this.usersFollowersRepository.usersFollowers.filter(
      (userFollower) => userFollower.followerId.toString() === userId,
    )

    const userPosts = this.postsRepository.inMemoryPosts.filter(
      (post) => post.ownerId.toString() === userId,
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
      numberOfFolloweds: userFolloweds.length,
      numberOfPosts: userPosts.length,
      posts: userPosts,
      followedUsers: followedsInfo,
    })
  }
}
