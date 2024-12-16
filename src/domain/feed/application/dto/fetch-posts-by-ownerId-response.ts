import { UserNotFoundError } from '@/core/errors/user-not-found-error'
import { Post } from '../../enterprise/entities/posts'
import { Either } from '@/core/either'

export type FetchPostsByOwnerIdResponse = Either<UserNotFoundError, Post[]>
