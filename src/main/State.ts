import * as Routes from '../consts/routes'
import withRouter, { HashHistory, RouterState, RouterActions, mkLink } from 'hydux/lib/enhancers/router'

export const actions = {
  showMenu: (show: boolean) => (state: State) => ({
    ...state,
    isMenuShow: show,
  })
}

export const state = {
  page: 'dashboard' as Routes.Page,
  isMenuShow: true,
}

export type _Actions = typeof actions
export type _State = typeof state
export type Actions = RouterActions<typeof actions>
export type State = RouterState<typeof state>

export const init = () => state
