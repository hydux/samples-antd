import { Cmd, CmdType, Sub, ActionResult, ActionsType } from 'hydux'

export type Id = string

export interface Paging<EOut, Q> {
  list: EOut[]
  start: number,
  limit: number,
  total: number,
  query: Q
}

export interface Client<EIn, EOut, Q> {
  fetchList<Q>(q: Q): Promise<Paging<EOut, Q>>
  fetchOne(id: Id): Promise<EOut>
  updateOne(e: EIn): Promise<EOut>
  createOne(e: EIn): Promise<EOut>
  removeOne(id: Id)
  outToIn(e: EOut): EIn
}

export interface State<EIn, EOut, Q> extends Object {
  readonly paging: Paging<EOut, Q>,
  readonly isLoading: boolean,
  readonly entity: Readonly<EIn>,
  readonly showEditDialog: boolean,
}

export function init<EIn, EOut, Q>(e: EIn, q: Q, _?: EOut): State<EIn, EOut, Q> {
  return {
    paging: {
      list: [],
      start: 0,
      limit: 20,
      total: 0,
      query: {} as Q,
    },
    isLoading: false,
    showEditDialog: false,
    entity: e,
  }
}

let a = init(1, 2, '')

export class Actions<EIn, EOut, Q, S extends State<EIn, EOut, Q> = State<EIn, EOut, Q>> {
  api: Client<EIn, EOut, Q>

  constructor(api: Client<EIn, EOut, Q>) {
    this.api = api
  }

  loadList = q => (state: S, actions: this) => [
    state,
    Cmd.ofPromise(
      this.api.fetchList,
      q,
      actions.updateLocalList,
    )
  ] as [S, CmdType<this>]

  loadOne = id => (state: S, actions: this) => [
    state,
    Cmd.ofPromise(
      this.api.fetchOne,
      id,
      actions.updateLocalOne,
    )
  ] as [S, CmdType<this>]

  updateOne = e => (state: S, actions: this) => [
    state,
    Cmd.ofPromise(
      this.api.updateOne,
      e,
      actions.updateLocalOne,
    )
  ] as [S, CmdType<this>]

  createOne = e => (state: S) => (actions: this) => [
    state,
    Cmd.ofPromise(
      this.api.createOne,
      e,
      actions.updateLocalOne,
    )
  ] as [S, CmdType<this>]

  saveOne = e => (state: S) => [
    state,
    Cmd.ofSub<this>(actions => (e as any).id
      ? actions.updateOne(e)
      : actions.createOne(e)
    )
  ] as [S, CmdType<this>]

  removeOne = (id: Id) => (state: S) => (actions: this) => [
    state,
    Cmd.ofPromise(
      this.api.removeOne,
      id,
      actions.updateLocalOne,
    )
  ] as [S, CmdType<this>]

  updateQuery = (q: Q) => (state: S) => ({
    ...(state as object),
    query: q,
  })

  toggleEditDialog = ([show, id]: [boolean, Id]) => (state: S) => [
    { ...(state as object),
      showEditDialog: show },
    Cmd.ofSub<this>(actions => show && actions.loadOne(id)),
  ] as [S, CmdType<this>]

  updateLocalList = (paging: Paging<EOut, Q>) => (state: S) => (
    { ...(state as object), paging }
  )

  updateLocalOne = e => (state: S) => [
    { ...(state as object), entity: this.api.outToIn(e) },
    Cmd.ofSub<this>(
      actions => actions.loadList(state.paging.query))
  ] as [S, CmdType<this>]
}
