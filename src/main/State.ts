import * as Routes from '../consts/routes'
import withRouter, { HashHistory, RouterState, RouterActions, mkLink } from 'hydux/lib/enhancers/router'
import * as User from '../pages/User'

export const actions = {
  showMenu: (show: boolean) => (state: State) => ({
    ...state,
    isMenuShow: show,
  }),
  user: User.State.actions,
}

export const state = {
  page: 'dashboard' as Routes.Page,
  isMenuShow: true,
  user: User.State.init(),
}

export type _Actions = typeof actions
export type _State = typeof state
export type Actions = RouterActions<typeof actions>
export type State = RouterState<typeof state>

export const init = () => state
