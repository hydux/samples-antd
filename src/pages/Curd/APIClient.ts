import { Paging, Client, Id, State, ValidateError } from './Types'
import axios from 'utils/axios'
import yup from 'yup'

export default abstract class CURDClient<EIn extends { id: Id }, EOut, Q> implements Client<EIn, EOut, Q> {
  name: string
  schema: yup.ObjectSchema
  constructor(name) {
    this.name = name
  }
  abstract emptyIn(): EIn
  // client should be binded
  fetchList = ([paging, query]: [Paging<EOut>, Q]): Promise<Paging<EOut>> => {
    console.log('CurdClient', this)
    return axios.get(`/api/${this.name}s`, {
      params: {
        start: paging.start,
        limit: paging.limit,
        ...(query as Object),
      }
    }) as any
  }
  fetchOne = (id: Id): Promise<EOut> => {
    return axios.get(`/api/${this.name}/${id}`) as any
  }
  updateOne = (e: EIn): Promise<EOut> => {
    return axios.put(`/api/${this.name}/${e.id}`, e) as any
  }
  createOne = (e: EIn): Promise<EOut> => {
    return axios.post(`/api/${this.name}/create`, e) as any
  }
  removeOne = (id: Id): Promise<any> => {
    return axios.delete(`/api/${this.name}/${id}`)
  }
  outToIn = (e: EOut): EIn => {
    return e as any as EIn
  }
  validate = (e: EIn) => {
    let errors: ValidateError<EIn> = {}
    try {
      e = this.schema.validateSync(e, {
      }) as any
    } catch (err) {
      errors[err.path] = err.message
      console.log('err', err)
    }
    console.log('validated', e)
    return [e, errors] as [EIn, typeof errors]
  }
}
