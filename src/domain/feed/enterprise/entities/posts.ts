import { Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValidationError } from '@/core/errors/validation-error'
import { Optional } from '@/core/types/optional'

export interface PostProps {
  content: string
  ownerId: UniqueEntityID
  originalPostId: UniqueEntityID | null
  createdAt: Date | string
}

export class Post extends Entity<PostProps> {
  get content() {
    return this.props.content
  }

  get ownerId() {
    return this.props.ownerId
  }

  get originalPostId() {
    return this.props.originalPostId
  }

  get createdAt() {
    return this.props.createdAt.toLocaleString()
  }

  static create(
    props: Optional<PostProps, 'originalPostId' | 'createdAt'>,
    id?: UniqueEntityID,
  ): Either<ValidationError, Post> {
    const post = new Post(
      {
        ...props,
        originalPostId: props.originalPostId ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const validationError = post.validate()

    if (validationError) {
      return left(validationError)
    }

    return right(post)
  }

  validate() {
    if (this.props.content.length > 200) {
      return new ValidationError(
        'post content not must be grater 200 characters',
      )
    }
  }
}
