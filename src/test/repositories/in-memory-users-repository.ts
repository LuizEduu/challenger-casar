import { UsersRepository } from '@/domain/feed/application/repositories/users-repository'
import { User } from '@/domain/feed/enterprise/entities/users'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[]

  constructor() {
    this.users = []
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toString() === id)

    return user ?? null
  }
}
