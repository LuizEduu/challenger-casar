import { CreatePostUseCase } from '@/domain/feed/application/use-cases/create-post'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PostsMaxQuantityError } from '@/core/errors/posts-max-quantity-error'
import { ValidationError } from 'zod-validation-error'
import { HttpPostsPresenter } from '../presenters/http-posts-presenter'

const createPostBodySchema = z.object({
  content: z.string(),
  ownerId: z.string(),
})

type CreatePostBodySchema = z.infer<typeof createPostBodySchema>

@Controller('/posts')
export class CreatePostController {
  constructor(private readonly useCase: CreatePostUseCase) {}

  @UsePipes(new ZodValidationPipe(createPostBodySchema))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() body: CreatePostBodySchema) {
    const { content, ownerId } = body

    const result = await this.useCase.execute({
      content,
      ownerId,
    })
    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
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
