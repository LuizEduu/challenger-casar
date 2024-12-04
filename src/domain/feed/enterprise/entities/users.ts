import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValidationError } from '@/core/errors/validation-error'

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

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)

    return user
  }

  validate() {
    if(this.name.length >=14) {
      throw new ValidationError('name not must be greater 14 characters')
    }

    const validateNameContainsOnlyAlfhaNumerics = /^[a-zA-Z0-9]+$/

    if(!validateNameContainsOnlyAlfhaNumerics.test((this.name))) {
      throw new ValidationError("The name must contain only alphanumeric characters")
    }
  }
}
