import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface FollowersProps {
  followerId: UniqueEntityID
  followedId: UniqueEntityID
  followedAt: Date
}

export class Followers extends Entity<FollowersProps> {
  get followerId() {
    return this.props.followerId
  }

  get followedId() {
    return this.props.followedId
  }

  get followedAt() {
    return this.props.followedAt
  }

  static create(
    props: Optional<FollowersProps, 'followedAt'>,
    id?: UniqueEntityID,
  ): Followers {
    const follower = new Followers(
      {
        ...props,
        followedAt: props.followedAt ?? new Date(),
      },
      id,
    )

    return follower
  }
}
