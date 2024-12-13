import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Comment } from '@/domain/feed/enterprise/entities/comments'
import { Post } from '@/domain/feed/enterprise/entities/posts'

describe('Post entity', () => {
  it('should create a post with valid properties', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const post = Post.create({ content: 'A valid post', ownerId })

    expect(post).toBeTruthy()
    expect(post.content).toEqual('A valid post')
    expect(post.ownerId).toEqual(ownerId)
    expect(post.originalPostId).toBeNull()
    expect(post.comment).toBeNull()
    expect(post.createdAt).toBeInstanceOf(Date)
  })

  it('should allow setting a comment', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const comment = Comment.create({
      content: 'A comment',
      postId: new UniqueEntityID('post-id'),
      ownerId,
    })
    const post = Post.create({ content: 'A valid post', ownerId })

    post.comment = comment

    expect(post.comment).toEqual(comment)
  })

  it('should default originalPostId and comment to null if not provided', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const post = Post.create({ content: 'A valid post', ownerId })

    expect(post.originalPostId).toBeNull()
    expect(post.comment).toBeNull()
  })

  it('should default createdAt to the current date if not provided', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const post = Post.create({ content: 'A valid post', ownerId })

    expect(post.createdAt).toBeInstanceOf(Date)
    const now = new Date()
    expect(new Date(post.createdAt).getDate()).toEqual(now.getDate())
    expect(new Date(post.createdAt).getMonth()).toEqual(now.getMonth())
    expect(new Date(post.createdAt).getFullYear()).toEqual(now.getFullYear())
  })

  it('should accept a custom createdAt date', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const customDate = new Date('2023-01-01T00:00:00Z')
    const post = Post.create({
      content: 'A valid post',
      ownerId,
      createdAt: customDate,
    })

    expect(post.createdAt).toEqual(customDate)
  })

  it('should validate content length is not greater than 200 characters', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const longContent = 'a'.repeat(201)
    const post = Post.create({ content: longContent, ownerId })

    const validationResult = post.validate()

    expect(validationResult.hasError).toBe(true)
    expect(validationResult.error).toEqual(
      'post content not must be grater 200 characters',
    )
  })

  it('should validate content length is valid if within limit', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const validContent = 'a'.repeat(200)
    const post = Post.create({ content: validContent, ownerId })

    const validationResult = post.validate()

    expect(validationResult.hasError).toBe(false)
    expect(validationResult.error).toEqual('')
  })

  it('should allow setting a custom originalPostId', () => {
    const ownerId = new UniqueEntityID('owner-id')
    const originalPostId = new UniqueEntityID('original-post-id')
    const post = Post.create({
      content: 'A valid post',
      ownerId,
      originalPostId,
    })

    expect(post.originalPostId).toEqual(originalPostId)
  })
})
