import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { HttpPostsPresenter } from '../presenters/http-posts-presenter'
import { FetchRecentPostsUseCase } from '@/domain/feed/application/use-cases/fetch-recents-posts'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/posts')
export class FetchRecentPostsController {
  constructor(private readonly useCase: FetchRecentPostsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.useCase.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      posts: result.value.map(HttpPostsPresenter.toHTTP),
    }
  }
}
