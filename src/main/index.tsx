import _app from 'hydux'
import withPersist from 'hydux/lib/enhancers/persist'
import withReact from 'hydux-react'
import * as React from 'react'
import { ActionsType } from 'hydux/lib/types'
import withRouter, { HashHistory, RouterState, RouterActions, mkLink } from 'hydux/lib/enhancers/router'
import { Link, history } from 'utils'
import * as State from './State'
import * as View from './View'
import * as Routes from 'consts/routes'
import 'antd/dist/antd.css'

// let app = withPersist<State, Actions>({
//   key: 'time-game/v1'
// })(_app)
let app = withReact<State._State, State._Actions>()(_app)
app = withRouter<State._State, State._Actions>({
  history: history as any,
  routes: Routes.default.routes,
} as any)(app)

if (process.env.NODE_ENV === 'development') {
  const devTools = require('hydux/lib/enhancers/devtools').default
  const logger = require('hydux/lib/enhancers/logger').default
  const hmr = require('hydux/lib/enhancers/hmr').default
  app = logger()(app)
  app = devTools()(app)
  app = hmr()(app)
}

export default app({
  init: State.init,
  actions: State.actions,
  view: View.root,
})
