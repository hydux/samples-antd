export type Id = string

export interface Paging<EOut> {
  list: EOut[]
  start: number,
  limit: number,
  total: number,
}

export interface State<EIn, EOut, Q> extends Object {
  readonly paging: Paging<EOut>,
  readonly isLoadingEntity: boolean,
  readonly entity: Readonly<EIn>,
  readonly showEditDialog: boolean,
  readonly entityErrors: ValidateError<EIn>
  readonly query: Q,
  readonly isLoadingList: boolean,
}

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
