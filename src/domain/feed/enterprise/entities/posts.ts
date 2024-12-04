import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PostProps {
  content: string
  ownerId: UniqueEntityID
  originalPostId: UniqueEntityID
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

  static create(props: PostProps, id?: UniqueEntityID) {
    const post = new Post(props, id)

    return post
  }
}
