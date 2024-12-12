import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { GetUserUseCase } from '@/domain/feed/application/use-cases/get-user'
import { HttpUsersPresenter } from '../presenters/http-users-presenter'

const paramsSchema = z.string()

const paramsValidationPipe = new ZodValidationPipe(paramsSchema)

type ParamsSchema = z.infer<typeof paramsSchema>

@Controller('/users/:userId')
export class GetUserController {
  constructor(private readonly useCase: GetUserUseCase) {}

  @Get()
  async handle(@Param('userId', paramsValidationPipe) userId: ParamsSchema) {
    const result = await this.useCase.execute({
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

    return {
      user: HttpUsersPresenter.toHTTP(result.value),
    }
  }
}
