import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { FollowerOrUnfollowerRequest } from '../dto/follower-or-unfollower-request'
import { UsersFollowersRepository } from '../repositories/users-followers-repository'
import { UsersRepository } from '../repositories/users-repository'
import { Followers } from '../../enterprise/entities/followers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FollowerOrUnfollowerResponse } from '../dto/follower-or-unfollower-response'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FollowerOrUnfollowerUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersFollowersRepository: UsersFollowersRepository,
  ) {}

  async execute({
    userId,
    followerUserId,
    follower,
  }: FollowerOrUnfollowerRequest): Promise<FollowerOrUnfollowerResponse> {
    if (userId === followerUserId) {
      return left(new NotAllowedError())
    }
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      return left(new UserNotFoundError())
    }

    const userToFollowerOrUnfollower =
      await this.usersRepository.findById(followerUserId)

    if (!userToFollowerOrUnfollower) {
      return left(new UserNotFoundError())
    }

    if (follower) {
      const newFollower = Followers.create({
        followerId: new UniqueEntityID(userId),
        followedId: new UniqueEntityID(followerUserId),
      })

      await this.usersFollowersRepository.create(newFollower)

      return right(null)
    }

    await this.usersFollowersRepository.delete(userId, followerUserId)

    return right(null)
  }
}
