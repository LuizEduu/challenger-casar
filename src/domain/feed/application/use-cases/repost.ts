import { Injectable } from '@nestjs/common'
import { PostsRepository } from '../repositories/posts-repository'
import { RepostRequest } from '../dto/repost-request'
import { RepostResponse } from '../dto/repost-response'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Post } from '../../enterprise/entities/posts'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PostsMaxQuantityError } from '@/core/errors/posts-max-quantity-error'
import { ValidationError } from '@/core/errors/validation-error'
import { Comment } from '../../enterprise/entities/comment'

@Injectable()
export class RepostUseCase {
  private readonly postsQuantityCreationInDay = 5
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    ownerId,
    originalPostId,
    comment,
  }: RepostRequest): Promise<RepostResponse> {
    const post = await this.postsRepository.findById(originalPostId)

    if (!post) {
      return left(new ResourceNotFoundError())
    }

    const userPosts = await this.postsRepository.countByOwnerIdInDay(ownerId)

    if (userPosts >= this.postsQuantityCreationInDay) {
      return left(
        new PostsMaxQuantityError('Maximum number of posts on the day reached'),
      )
    }

    const newPost = Post.create({
      content: post.content,
      ownerId: new UniqueEntityID(ownerId),
      originalPostId: new UniqueEntityID(originalPostId),
    })

    const { hasError, error } = post.validate()

    if (hasError) {
      return left(new ValidationError(error))
    }

    const commentOnPost = comment
      ? Comment.create({
          content: comment,
          ownerId: new UniqueEntityID(ownerId),
          postId: newPost.id,
        })
      : null

    newPost.comment = commentOnPost

    await this.postsRepository.create(newPost)

    return right(newPost)
  }
}
