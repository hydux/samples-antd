import { CRUDClient, Types } from '../Crud'

export interface UserIn {
  id: string
  name: string
  birthday: string
}

export interface UserOut {
  id: string
  name: string
  birthday: string
}

export interface UserQuery {
  id: string
  name: string
}

export class UserClient extends CRUDClient<UserIn, UserOut, UserQuery> {
  constructor() {
    super('user')
  }

  outToIn = (e: UserOut): UserIn => {
    return e
  }

  validate = (e: UserIn) => {
    let errors: Types.ValidateError<UserIn> = {}
    if (e.name.length > 6) {
      errors.name = '名字长度不能超过6'
    }
    return errors
  }

  emptyIn(): UserIn {
    return {
      id: '',
      name: '',
      birthday: '',
    }
  }
  emptyOut(): UserOut {
    return this.emptyIn()
  }
  emptyQuery(): UserQuery {
    return {
      id: '',
      name: '',
    }
  }
}

export default new UserClient()
