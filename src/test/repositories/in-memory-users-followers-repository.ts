import { UsersFollowersRepository } from '@/domain/feed/application/repositories/users-followers-repository'
import { Followers } from '@/domain/feed/enterprise/entities/followers'

export class InMemoryUsersFollowersRepository
  implements UsersFollowersRepository
{
  public usersFollowers: Followers[]

  constructor() {
    this.usersFollowers = []
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
}
