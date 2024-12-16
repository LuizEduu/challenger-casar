import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PostsMaxQuantityError } from '@/core/errors/posts-max-quantity-error'
import { ValidationError } from 'zod-validation-error'
import { HttpPostsPresenter } from '../presenters/http-posts-presenter'
import { RepostUseCase } from '@/domain/feed/application/use-cases/repost'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

const repostBodySchema = z.object({
  ownerId: z.string().max(200),
  originalPostId: z.string(),
  comment: z.string().max(200).optional(),
})

type RepostBodySchema = z.infer<typeof repostBodySchema>

@Controller('/posts/repost')
export class RepostController {
  constructor(private readonly useCase: RepostUseCase) {}

  @UsePipes(new ZodValidationPipe(repostBodySchema))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() body: RepostBodySchema) {
    const { ownerId, originalPostId, comment } = body

    const result = await this.useCase.execute({
      ownerId,
      originalPostId,
      comment,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case PostsMaxQuantityError:
          throw new UnprocessableEntityException(error.message)
        case ValidationError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      post: HttpPostsPresenter.toHTTP(result.value),
    }
  }
}
