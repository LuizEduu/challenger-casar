import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Post } from '@/domain/feed/enterprise/entities/posts'
import { faker } from '@faker-js/faker'

/**
 * @type {object}
 * @property {UniqueEntityID} ownerId - id do autor do post.
 * @property {UniqueEntityID} originalPostId - id do post original caso seja um repost.
 * @property {string} content - Conteúdo da pergunta.
 * @property {Date} createdAt - data de criação.
 *
 * @type {UniqueEntityID} id - criar a pergunta com id especifíco.
 *
 * @returns {Post}
 */
export function makePost(
  override: Partial<Post> = {},
  id?: UniqueEntityID,
): Post {
  const post = Post.create(
    {
      content: faker.lorem.sentence({
        min: 10,
        max: 180,
      }),
      ownerId: new UniqueEntityID(),
      originalPostId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return post.value as Post
}
