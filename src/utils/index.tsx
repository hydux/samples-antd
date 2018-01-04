
import { mkLink, HashHistory } from 'hydux/lib/enhancers/router'
import * as React from 'react'
import _Debug from 'debug'
const _debug = _Debug('MyAwesomeApp')

export function mkReactComp<State, Actions>(name, module) {
  function HyduxComp(props: { state: State, actions: Actions }) {
    return module.view(props.state)(props.actions)
  }
  (HyduxComp as any).displayName = name
  return HyduxComp
}
export const history = new HashHistory()
export const Link = mkLink(history, React.createElement)

export function Debug(file: string) {
  return (...args) => _debug(file, ...args)
}
