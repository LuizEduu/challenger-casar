import { User } from '../../enterprise/entities/users'
import { UserWithFollowersAndPosts } from '../../enterprise/entities/value-objects/user-with-followers-and-posts'

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findByIdUserWithFollowersAndPosts(
    userId: string,
  ): Promise<UserWithFollowersAndPosts | null>
}
