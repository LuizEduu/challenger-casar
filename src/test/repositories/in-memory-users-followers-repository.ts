import { UsersFollowersRepository } from '@/domain/feed/application/repositories/users-followers-repository'
import { Followers } from '@/domain/feed/enterprise/entities/followers'

export class InMemoryUsersFollowersRepository
  implements UsersFollowersRepository
{
  public usersFollowers: Followers[]

  constructor() {
    this.usersFollowers = []
  }

  async create(follower: Followers): Promise<void> {
    this.usersFollowers.push(follower)
  }

  async fetchByUserId(id: string): Promise<Followers[]> {
    return this.usersFollowers.filter(
      (userFollowers) => userFollowers.followerId.toString() === id,
    )
  }

  async fetchFollowedsByUserIdWithFollowedsInfo(
    userId: string,
  ): Promise<Followers[]> {
    return this.usersFollowers.filter(
      (userFollower) => userFollower.followerId.toString() === userId,
    )
  }

  async delete(userId: string, followerId: string): Promise<void> {
    const registerToDeleteIndex = this.usersFollowers.findIndex(
      (follower) =>
        follower.followerId.toString() === userId &&
        follower.followedId.toString() === followerId,
    )

    this.usersFollowers.splice(registerToDeleteIndex, 1)
  }
}
