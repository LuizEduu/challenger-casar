import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Comment } from '@/domain/feed/enterprise/entities/comments'

describe('Comment entity', () => {
  it('should create a comment with valid properties', () => {
    const postId = new UniqueEntityID('post-id')
    const ownerId = new UniqueEntityID('owner-id')
    const content = 'This is a valid comment'

    const comment = Comment.create({ content, postId, ownerId })

    expect(comment).toBeTruthy()
    expect(comment.content).toEqual(content)
    expect(comment.postId).toEqual(postId)
    expect(comment.ownerId).toEqual(ownerId)
    expect(comment.createdAt).toBeInstanceOf(Date)
  })

  it('should default createdAt to the current date if not provided', () => {
    const postId = new UniqueEntityID('post-id')
    const ownerId = new UniqueEntityID('owner-id')
    const content = 'This is a valid comment'

    const comment = Comment.create({ content, postId, ownerId })

    expect(comment.createdAt).toBeInstanceOf(Date)
    const now = new Date()
    expect(new Date(comment.createdAt).getDate()).toEqual(now.getDate())
    expect(new Date(comment.createdAt).getMonth()).toEqual(now.getMonth())
    expect(new Date(comment.createdAt).getFullYear()).toEqual(now.getFullYear())
  })

  it('should accept a custom createdAt date', () => {
    const postId = new UniqueEntityID('post-id')
    const ownerId = new UniqueEntityID('owner-id')
    const content = 'This is a valid comment'
    const customDate = new Date('2023-01-01T00:00:00Z')

    const comment = Comment.create({
      content,
      postId,
      ownerId,
      createdAt: customDate,
    })

    expect(comment.createdAt).toEqual(customDate)
  })

  it('should validate content length is not greater than 200 characters', () => {
    const postId = new UniqueEntityID('post-id')
    const ownerId = new UniqueEntityID('owner-id')
    const longContent = 'a'.repeat(201)

    const comment = Comment.create({ content: longContent, postId, ownerId })

    const validationResult = comment.validate()

    expect(validationResult.hasError).toBe(true)
    expect(validationResult.error).toEqual(
      'comment content not must be grater 200 characters',
    )
  })

  it('should validate content length is valid if within limit', () => {
    const postId = new UniqueEntityID('post-id')
    const ownerId = new UniqueEntityID('owner-id')
    const validContent = 'a'.repeat(200)

    const comment = Comment.create({ content: validContent, postId, ownerId })

    const validationResult = comment.validate()

    expect(validationResult.hasError).toBe(false)
    expect(validationResult.error).toEqual('')
  })

  it('should accept an optional unique ID', () => {
    const postId = new UniqueEntityID('post-id')
    const ownerId = new UniqueEntityID('owner-id')
    const content = 'This is a valid comment'
    const uniqueId = new UniqueEntityID('custom-id')

    const comment = Comment.create({ content, postId, ownerId }, uniqueId)

    expect(comment.id).toEqual(uniqueId)
  })
})
