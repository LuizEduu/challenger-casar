import { Either } from '@/core/either'
import { Post } from '../../enterprise/entities/posts'

export type FetchRecentsPostsResponse = Either<null, Post[]>
