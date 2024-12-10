import { Followers } from '../../enterprise/entities/followers'

export abstract class UsersFollowersRepository {
  abstract fetchByUserId(id: string): Promise<Followers[]>
  abstract fetchFollowedsByUserIdWithFollowedsInfo(
    userId: string,
  ): Promise<Followers[]>
}
