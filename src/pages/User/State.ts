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
  curd: State.initActions(client)
}

let s: ReadonlySet<string> = new Set()

export type State = Readonly<typeof state>
export type Actions = Readonly<typeof actions>
