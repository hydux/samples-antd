import { CURDClient, Types } from '../Curd'
import yup from 'yup'
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

export class UserClient extends CURDClient<UserIn, UserOut, UserQuery> {

  schema = yup.object({
    id: yup.string().matches(/^\d*$/),
    name: yup.string().max(10, '最长10个字符').min(4, '最小4个字符'),
    birthday: yup.string().matches(/^\d{4}-[01][0-9]-[0-3][0-9]$/, '非法生日格式'),
  })

  constructor() {
    super('user')
  }

  outToIn = (e: UserOut): UserIn => {
    return e
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
