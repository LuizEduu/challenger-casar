import { Either } from '@/core/either'
import { Post } from '../../enterprise/entities/posts'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

export type RepostResponse = Either<ResourceNotFoundError, Post>
