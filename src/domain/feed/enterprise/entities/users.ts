import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValidationError } from '@/core/errors/validation-error'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  createdAt: Date | string
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt.toLocaleString()
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    user.validate()

    return user
  }

  validate() {
    if (this.props.name.length > 14) {
      throw new ValidationError('name not must be grater then 14 characters')
    }

    const validateNameIsAlphaNumeric = /^[a-zA-Z0-9]+$/

    if (!validateNameIsAlphaNumeric.test(this.props.name)) {
      throw new ValidationError('name must be only alpha numeric characters')
    }
  }
}
