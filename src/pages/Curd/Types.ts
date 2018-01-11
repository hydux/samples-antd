export type Id = string

export interface Paging<EOut> {
  list: EOut[]
  start: number,
  limit: number,
  total: number,
}

export type RawState<EIn, EOut, Q> = {
  paging: Paging<EOut>,
  isLoadingEntity: boolean,
  entity: Readonly<EIn>,
  showEditDialog: boolean,
  entityErrors: ValidateError<EIn>
  query: Q,
  isLoadingList: boolean,
}

export type State<EIn, EOut, Q> = Readonly<RawState<EIn, EOut, Q>>

export interface Client<EIn, EOut, Q> {
  fetchList(arg: [Paging<EOut>, Q]): Promise<Paging<EOut>>
  fetchOne(id: Id): Promise<EOut>
  updateOne(e: EIn): Promise<EOut>
  createOne(e: EIn): Promise<EOut>
  removeOne(id: Id): Promise<any>
  outToIn(e: EOut): EIn
  validate(e: EIn): [EIn, ValidateError<EIn>]
  emptyIn(): EIn
}

export type ValidateError<T> = {
  [P in keyof T]?: string
}
