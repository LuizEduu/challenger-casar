import { Injectable } from '@nestjs/common'
import { Post } from '../../enterprise/entities/posts'
import { CreatePostRequest } from '../dto/create-post-request'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PostsRepository } from '../repositories/posts-repository'
import { CreatePostResponse } from '../dto/create-post-response'
import { left, right } from '@/core/either'
import { PostsMaxQuantityError } from '@/core/errors/posts-max-quantity-error'

@Injectable()
export class CreatePostUseCase {
  private readonly postsQuantityCreationInDay = 5

  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    content,
    ownerId,
    originalPostId,
  }: CreatePostRequest): Promise<CreatePostResponse> {
    const userPosts = await this.postsRepository.countByOwnerIdInDay(ownerId)

    if (userPosts >= this.postsQuantityCreationInDay) {
      return left(
        new PostsMaxQuantityError('Maximum number of posts on the day reached'),
      )
    }

    const post = Post.create({
      content,
      ownerId: new UniqueEntityID(ownerId),
      originalPostId: originalPostId
        ? new UniqueEntityID(originalPostId)
        : null,
    })

    if (post.isLeft()) {
      return left(post.value)
    }

    await this.postsRepository.create(post.value)

    return right(post.value)
  }
}
