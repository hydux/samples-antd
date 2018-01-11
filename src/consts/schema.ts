import { ColumnProps } from 'antd/lib/table/interface'
import t from 'io-ts'

export interface Schema {
  routes: Routes
}

export interface Routes {
  path: string
  label?: string
  page?: Page<any, any, any>
  children?: Routes[]
}

export interface Domain<T> {
  schema: object
  schemaType: 'json-schema' | 'yup' | 'none'
  empty: T
  key?: string // 'id'
}

export interface PageDomains<DIn, DOut, Q> {
  name: string
  in: Domain<DIn>
  out: Domain<DOut>
  query: Domain<Q>
}

export type InputField = {
  type: 'text' | 'datetime' | 'date' | 'time' | 'number' | 'checkbox' | 'color' | 'email' | 'file' | 'password' | 'radio' | 'url',
  props?: object
}

export interface SelectField {
  type: 'select'
  multiple: boolean
  options: {
    label: string
    value: string
  }[],
  props?: object
}

export interface FormField<T> {
  name: keyof T
  label: string
  input: InputField | SelectField
  required: boolean
}

export interface Form<T> {
  fields: FormField<T>[]
}

export interface Table<DOut> {
  columns: ColumnProps<DOut>[]
}

export interface PageUI<DIn, DOut, Q> {
  table: Table<DOut>
  form?: Form<DIn>
  searchForm?: Form<Q>
}

export interface API {
  method: string
  url: string
}

export interface APIs {
  createOne: API
  updateOne: API
  removeOne: API
  queryOne: API
  queryList: API
}

export interface Page<DIn, DOut, Q> {
  domains: PageDomains<DIn, DOut, Q>
  apis: APIs
  ui: PageUI<DIn, DOut, Q>
}
