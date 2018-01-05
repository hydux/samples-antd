import { CRUDClient, Types } from '../Crud'
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

export class UserClient extends CRUDClient<UserIn, UserOut, UserQuery> {

  schema = yup.object({
    id: yup.string().matches(/^\d*$/),
    name: yup.string().max(10, '最长10个字符').min(4, '最小4个字符'),
    birthday: yup.string().matches(/\d{4}-[01][0-9]-[0-3][0-9]/, '非法生日格式'),
  })

  constructor() {
    super('user')
  }

  outToIn = (e: UserOut): UserIn => {
    return e
  }

  validate = (e: UserIn) => {
    let errors: Types.ValidateError<UserIn> = {}
    try {
      e = this.schema.validateSync(e, {
      }) as any
    } catch (err) {
      errors[err.path] = err.message
      console.log('err', err)
    }
    console.log('validated', e)
    return [e, errors] as [UserIn, typeof errors]
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
