import { NestedRoutes, parseNestedRoutes } from 'hydux/lib/enhancers/router'
import * as State from '../main/state'
import * as CurdPage from 'pages/Crud'
import { noop, Cmd } from 'hydux'

export type Page =
| 'dashboard'
| 'users'

export interface MyNestedRoutes<State, Actions> extends NestedRoutes<State, Actions> {
  icon?: string
  parents?: MyNestedRoutes<State, Actions>[],
  children: MyNestedRoutes<State, Actions>[]
}

export const rawRoutes: MyNestedRoutes<State.State, State.Actions> = {
  path: '/',
  action: noop,
  parents: [],
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
      action: loc => state => [({ ...state, page: 'users' }), Cmd.ofSub<State.Actions>(actions => {
        actions.user.crud.loadList()
      })],
      children: [],
    }],
  }]
}

export function join(...args: string[]) {
  return args.join('/').replace(/\/+/g, '/')
}

const routes = parseNestedRoutes(rawRoutes)

console.log(routes)

export default routes
