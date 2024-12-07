import { Either } from '@/core/either'
import { Post } from '../../enterprise/entities/posts'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'

export type FetchRecentsFollowedPostsResponse = Either<
  UserNotFoundError,
  Post[]
>
