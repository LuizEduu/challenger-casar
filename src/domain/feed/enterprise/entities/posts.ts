import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment } from './comment'

export interface PostProps {
  content: string
  ownerId: UniqueEntityID
  originalPostId: UniqueEntityID | null
  comment?: Comment | null
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

  get comment(): Comment | null | undefined {
    return this.props.comment
  }

  set comment(comment: Comment | null) {
    this.props.comment = comment
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<PostProps, 'originalPostId' | 'comment' | 'createdAt'>,
    id?: UniqueEntityID,
  ): Post {
    const post = new Post(
      {
        ...props,
        originalPostId: props.originalPostId ?? null,
        comment: props.comment ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return post
  }

  validate(): {
    hasError: boolean
    error: string
  } {
    if (this.props.content.length > 200) {
      return {
        hasError: true,
        error: 'post content not must be grater 200 characters',
      }
    }

    return {
      hasError: false,
      error: '',
    }
  }
}
