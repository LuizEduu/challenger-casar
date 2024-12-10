import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Followers } from '@/domain/feed/enterprise/entities/followers'

/**
 * @type {object}
 * @property {UniqueEntityID} followerId - id do usuário que está seguindo.
 * @property {UniqueEntityID} followedId - id do usuário que foi seguido.
 * @property {Date} createdAt - data de criação.
 *
 * @type {UniqueEntityID} id - criar o follower com id específico.
 *
 * @returns {Followers}
 */
export function makeFollower(
  override: Partial<Followers> = {},
  id?: UniqueEntityID,
): Followers {
  const follower = Followers.create(
    {
      followerId: override.followedId ?? new UniqueEntityID(),
      followedId: override.followedId ?? new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return follower
}
