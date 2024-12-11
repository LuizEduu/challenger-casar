import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FollowerOrUnfollowerUseCase } from '@/domain/feed/application/use-cases/follower-or-unfollower'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'

const followerOrUnfollowerBodySchema = z.object({
  userId: z.string(),
  followerUserId: z.string(),
  follower: z.boolean(),
})

type FollowerOrUnfollowerBodySchema = z.infer<
  typeof followerOrUnfollowerBodySchema
>

@Controller('/followers')
export class FollowerOrUnfollowerController {
  constructor(private readonly useCase: FollowerOrUnfollowerUseCase) {}

  @UsePipes(new ZodValidationPipe(followerOrUnfollowerBodySchema))
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Body() body: FollowerOrUnfollowerBodySchema) {
    const { follower, followerUserId, userId } = body

    const result = await this.useCase.execute({
      follower,
      followerUserId,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
