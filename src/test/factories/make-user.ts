import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/feed/enterprise/entities/users'
import { faker } from '@faker-js/faker'

/**
 * @type {object}
 * @property {string} name - nome do usuário.
 * @property {Date} createdAt - data de criação.
 *
 * @type {UniqueEntityID} id - criar o user com id especifíco.
 *
 * @returns {User}
 */
export function makeUser(
  override: Partial<User> = {},
  id?: UniqueEntityID,
): User {
  return User.create(
    {
      name: faker.person.firstName(),
      ...override,
    },
    id,
  )
}
