import client from './APIClient'
import { State } from '../Curd'

export const emptyIn = client.emptyIn
export const emptyOut = client.emptyOut
export const emptyQuery = client.emptyQuery

const state = {
  curd: State.init(client.emptyIn(), client.emptyOut(), client.emptyQuery()),
}

export const init = () => state

export const actions = {
  curd: new State.Actions(client)
}

export type State = typeof state
export type Actions = typeof actions
