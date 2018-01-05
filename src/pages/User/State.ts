import client, { UserIn, UserOut, UserQuery } from './APIClient'
import { State } from '../Crud'

const state = {
  crud: State.init(client.emptyIn(), client.emptyOut(), client.emptyQuery()),
}

export const init = () => state

export const actions = {
  crud: new State.Actions(client)
}

export type State = typeof state
export type Actions = typeof actions
