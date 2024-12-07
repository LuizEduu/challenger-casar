import { User } from '../../enterprise/entities/users'

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>
}
