import { Either } from '@/core/either'
import { Post } from '../../enterprise/entities/posts'
import { ValidationError } from '@/core/errors/validation-error'

export type CreatePostResponse = Either<ValidationError, Post>
