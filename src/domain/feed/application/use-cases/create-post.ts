import { Injectable } from '@nestjs/common'
import { Post } from '../../enterprise/entities/posts'
import { CreatePostRequest } from '../dto/create-post-request'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PostsRepository } from '../repositories/posts-repository'
import { CreatePostResponse } from '../dto/create-post-response'
import { left, right } from '@/core/either'
import { PostsMaxQuantityError } from '@/core/errors/posts-max-quantity-error'
import { ValidationError } from '@/core/errors/validation-error'
import { Comment } from '../../enterprise/entities/comments'

@Injectable()
export class CreatePostUseCase {
  private readonly postsQuantityCreationInDay = 5

  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    content,
    ownerId,
    comment,
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
      originalPostId: null,
    })

    const { hasError, error } = post.validate()

    if (hasError) {
      return left(new ValidationError(error))
    }

    const postComment = comment
      ? Comment.create({
          content: comment,
          ownerId: post.ownerId,
          postId: post.id,
        })
      : null

    const validateComment = postComment?.validate()

    if (validateComment?.hasError) {
      return left(new ValidationError(error))
    }

    post.comment = postComment

    await this.postsRepository.create(post)

    return right(post)
  }
}
