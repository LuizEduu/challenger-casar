import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { GetUserRequest } from '../dto/get-user-request'
import { UsersRepository } from '../repositories/users-repository'
import { GetUserResponse } from '../dto/get-user-response'
import { left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserRequest): Promise<GetUserResponse> {
    const userWithFollowersAndPosts =
      await this.usersRepository.findByIdUserWithFollowersAndPosts(userId)

    if (!userWithFollowersAndPosts) {
      return left(new UserNotFoundError())
    }

    return right(userWithFollowersAndPosts)
  }
}
