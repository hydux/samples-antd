import { Paging, Client, Id, State, ValidateError } from './Types'
import axios from 'utils/axios'

export default abstract class CRUDClient<EIn extends { id: Id }, EOut, Q> implements Client<EIn, EOut, Q> {
  name: string
  constructor(name) {
    this.name = name
  }
  abstract emptyIn(): EIn

  fetchList = (paging: Paging<EOut, Q>): Promise<Paging<EOut, Q>> => {
    return axios.get(`/api/${this.name}s`, {
      params: {
        start: paging.start,
        limit: paging.limit,
        ...(paging.query as Object),
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
  validate = (e: EIn): ValidateError<EIn> => {
    return {}
  }
}
