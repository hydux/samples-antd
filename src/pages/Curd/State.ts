import { Cmd, CmdType, Sub, ActionsType, ActionResult } from 'hydux'
import { setIn, updateIn, unsetIn } from 'hydux-mutator'
import { State, Id, Client, Paging } from './Types'
export { State }
export function init<EIn, EOut, Q>(eIn: EIn, eOut: EOut, q: Q): State<EIn, EOut, Q> {
  return {
    paging: {
      list: [],
      start: 0,
      limit: 20,
      total: 0,
    },
    isLoadingEntity: false,
    showEditDialog: false,
    entity: eIn,
    entityErrors: {},
    query: q,
    isLoadingList: false,
  }
}

export class Actions<EIn, EOut, Q, S extends State<EIn, EOut, Q> = State<EIn, EOut, Q>> {
  private _client: Client<EIn, EOut, Q>

  constructor(client: Client<EIn, EOut, Q>) {
    this._client = client
  }

  loadList = (paging?: Paging<EOut>) => (state: S, actions: this): [S, CmdType<this>] => {
    state = setIn(state, _ => _.isLoadingList, true)
    state = paging && Array.isArray(paging.list)
      ? setIn(state, _ => _.paging, paging)
      : state
    return [
      state,
      Cmd.ofPromise(
        this._client.fetchList,
        [paging || state.paging, state.query],
        actions.updateLocalList,
      )
    ]
  }

  loadOne = (id: Id) => (state: S, actions: this) => [
    setIn(state, _ => _.isLoadingEntity, true),
    Cmd.ofPromise(
      this._client.fetchOne,
      id,
      actions.updateEntityByOut,
    )
  ]

  updateOne = () => (state: S, actions: this): ActionResult<S, this> => {
    if (Object.keys(state.entityErrors).length) {
      return
    }
    return [
      state,
      Cmd.ofPromise(
        this._client.updateOne,
        state.entity,
        actions.editSuccess,
      )
    ]
  }

  createOne = () => (state: S) => (actions: this): ActionResult<S, this> => {
    if (Object.keys(state.entityErrors).length) {
      return
    }
    return [
      state,
      Cmd.ofPromise(
        this._client.createOne,
        state.entity,
        actions.editSuccess,
      )
    ]
  }

  saveOne = () => (state: S): ActionResult<S, this> => {
    if (Object.keys(state.entityErrors).length) {
      return
    }
    return [
      state,
      Cmd.ofSub<this>(actions => (state.entity as any).id
        ? actions.updateOne()
        : actions.createOne()
      )
    ]
  }

  removeOne = (id: Id) => (state: S, actions: this): ActionResult<S, this> => [
    state,
    Cmd.ofPromise<Id, EOut, S, this>(
      this._client.removeOne,
      id,
      _ => actions.loadList(),
    )
  ]

  updateQuery = (q: Q) => (state: S): ActionResult<S, this> =>
    setIn(state, _ => _.query, q)
  // actions should be binded
  toggleEditDialog = ([show, id]: [boolean, Id | void]) => (state: S): ActionResult<S, this> => {
    let cmd = Cmd.none
    state = setIn(state, _ => _.showEditDialog, show)
    state = setIn(state, _ => _.entityErrors, {})
    if (id && show) {
      cmd = Cmd.ofSub<this>(actions => show && actions.loadOne(id))
    } else {
      state = setIn(state, _ => _.entity, this._client.emptyIn())
    }
    return [state, cmd]
  }

  updateLocalList = (paging: Paging<EOut>) => (state: S): ActionResult<S, this> => (
    state = setIn(state, _ => _.paging, paging),
    setIn(state, _ => _.isLoadingList, false)
  )

  editSuccess = (e: EOut) => (state: S): ActionResult<S, this> => [
    state,
    Cmd.ofSub<this>(actions => {
      actions.updateEntityByOut(e)
      actions.toggleEditDialog([false, void 0])
      actions.loadList()
    })
  ]

  updateEntityByOut = (e: EOut) => (state: S): ActionResult<S, this> => (
    state = setIn(state, _ => _.entity, this._client.outToIn(e)),
    setIn(state, _ => _.isLoadingEntity, false)
  )

  updateEntity = (e: EIn) => (state: S): ActionResult<S, this> => {
    const errors = this._client.validate(e)
    let nextState = setIn(state, _ => _.entity, errors[0])
    return setIn(nextState, _ => _.entityErrors, errors[1])
  }
}
