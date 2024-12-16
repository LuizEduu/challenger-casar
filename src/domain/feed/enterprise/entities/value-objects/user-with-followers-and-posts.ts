import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import dayjs from 'dayjs'

type followedUsers = {
  userId: UniqueEntityID
  name: string
}[]

export interface UserWithFollowersAndPostsProps {
  name: string
  ingressedAt: Date | string
  numberOfFollowers: number
  numberOfFolloweds: number
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
    return dayjs(this.props.ingressedAt.toString()).format('DD/MM/YYYY')
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

  get numberOfFolloweds() {
    return this.props.numberOfFolloweds
  }

  set numberOfFolloweds(numberOfFolloweds: number) {
    this.props.numberOfFolloweds = numberOfFolloweds
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
