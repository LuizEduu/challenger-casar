import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { HttpPostsPresenter } from '../presenters/http-posts-presenter'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { FetchPostsByOwnerIdUseCase } from '@/domain/feed/application/use-cases/fetch-posts-by-owner-id'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const paramsSchema = z.string()

const paramsValidationPipe = new ZodValidationPipe(paramsSchema)

type ParamsSchema = z.infer<typeof paramsSchema>

@Controller('/users/:userId/posts')
export class FetchPostsByOwnerIdController {
  constructor(private readonly useCase: FetchPostsByOwnerIdUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('userId', paramsValidationPipe) userId: ParamsSchema,
  ) {
    const result = await this.useCase.execute({
      userId,
      page,
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
      posts: result.value.map(HttpPostsPresenter.toHTTP),
    }
  }
}
