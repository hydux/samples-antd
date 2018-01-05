export type Id = string

export interface Paging<EOut, Q> {
  list: EOut[]
  start: number,
  limit: number,
  total: number,
  query: Q,
  isLoading: boolean,
}

export interface State<EIn, EOut, Q> extends Object {
  readonly paging: Paging<EOut, Q>,
  readonly isLoadingEntity: boolean,
  readonly entity: Readonly<EIn>,
  readonly showEditDialog: boolean,
  readonly entityErrors: ValidateError<EIn>
}

export interface Client<EIn, EOut, Q> {
  fetchList(paging: Paging<EOut, Q>): Promise<Paging<EOut, Q>>
  fetchOne(id: Id): Promise<EOut>
  updateOne(e: EIn): Promise<EOut>
  createOne(e: EIn): Promise<EOut>
  removeOne(id: Id): Promise<any>
  outToIn(e: EOut): EIn
  validate(e: EIn): ValidateError<EIn>
  emptyIn(): EIn
}

export type ValidateError<T> = {
  [P in keyof T]?: string
}
