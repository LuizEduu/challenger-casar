import { Either } from '@/core/either'
import { Post } from '../../enterprise/entities/posts'
import { ResourceNotFound } from '@/core/errors/resource-not-found'

export type RepostResponse = Either<ResourceNotFound, Post>
