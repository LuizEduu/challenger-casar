import { Followers } from '../../enterprise/entities/followers'

export abstract class UsersFollowersRepository {
  abstract create(follower: Followers): Promise<void>
  abstract fetchByUserId(id: string): Promise<Followers[]>
  abstract fetchFollowedsByUserIdWithFollowedsInfo(
    userId: string,
  ): Promise<Followers[]>

  abstract delete(userId: string, followerId: string): Promise<void>
}
