import { Either } from '@/core/either'
import { UserNotFoundError } from '@/core/errors/user-not-found-error'

export type FollowerOrUnfollowerResponse = Either<UserNotFoundError, null>
