import { NestedRoutes, parseNestedRoutes } from 'hydux/lib/enhancers/router'
import * as State from '../main/state'
import * as CurdPage from 'pages/Crud'
import { noop } from 'hydux'

export type User = {
  name: string,
  id: string,
  age: number,
}

export type UserQuery = {
  id?: string,
}

export type Page =
| 'dashboard'
| 'users'

export interface MyNestedRoutes<State, Actions> extends NestedRoutes<State, Actions> {
  icon?: string
  children: MyNestedRoutes<State, Actions>[]
}

export const rawRoutes: MyNestedRoutes<State.State, State.Actions> = {
  path: '/',
  action: noop,
  children: [{
    path: '/general',
    label: 'General',
    icon: 'user',
    children: [{
      path: '/dashboard',
      label: 'Dashboard',
      action: loc => state => ({ ...state, page: 'dashboard' }),
      children: []
    }, {
      path: '/users',
      label: 'Users',
      action: loc => state => ({ ...state, page: 'users' }),
      children: [],
    }],
  }]
}

export function join(...args: string[]) {
  return args.join('/').replace(/\/+/g, '/')
}

export default parseNestedRoutes(rawRoutes)
