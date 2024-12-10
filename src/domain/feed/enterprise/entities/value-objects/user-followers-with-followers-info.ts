import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface UserFollowersWithFollowersInfoProps {
  id: UniqueEntityID
  name: string
  createdAt: Date
}

export class UserFollowersWithFollowersInfo extends ValueObject<UserFollowersWithFollowersInfoProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: UserFollowersWithFollowersInfoProps) {
    return new UserFollowersWithFollowersInfo(props)
  }
}
