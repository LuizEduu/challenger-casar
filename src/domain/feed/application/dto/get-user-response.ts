import { Either } from '@/core/either'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { UserWithFollowersAndPosts } from '../../enterprise/entities/value-objects/user-with-followers-and-posts'

export type GetUserResponse = Either<
  UserNotFoundError,
  UserWithFollowersAndPosts
>
