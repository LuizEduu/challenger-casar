import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

type followedUsers = {
  userId: UniqueEntityID
  name: string
}[]

export interface UserWithFollowersAndPostsProps {
  name: string
  ingressedAt: Date | string
  numberOfFollowers: number
  numberOfFollowed: number
  numberOfPosts: number
  followedUsers: followedUsers
}

export class UserWithFollowersAndPosts extends ValueObject<UserWithFollowersAndPostsProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get ingressedAt() {
    return this.props.ingressedAt
  }

  set ingressedAt(ingressedAt: Date | string) {
    this.props.ingressedAt = ingressedAt
  }

  get numberOfFollowers() {
    return this.props.numberOfFollowers
  }

  set numberOfFollowers(numberOfFollowers: number) {
    this.props.numberOfFollowers = numberOfFollowers
  }

  get numberOfFollowed() {
    return this.props.numberOfFollowed
  }

  set numberOfFollowed(numberOfFollowed: number) {
    this.props.numberOfFollowed = numberOfFollowed
  }

  get numberOfPosts() {
    return this.props.numberOfPosts
  }

  set numberOfPosts(numberOfPosts: number) {
    this.props.numberOfPosts = numberOfPosts
  }

  get followedUsers() {
    return this.props.followedUsers
  }

  set followedUsers(followedUsers: followedUsers) {
    this.props.followedUsers = followedUsers
  }

  static create(props: UserWithFollowersAndPostsProps) {
    return new UserWithFollowersAndPosts(props)
  }
}
