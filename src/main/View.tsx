import './style.scss'
import * as React from 'react'
import * as State from './State'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import * as Routes from '../consts/routes'
import { Debug } from 'utils'
import * as User from 'pages/User'

const debug = Debug(__filename)

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout
const routesMeta = Routes.default.meta

function renderMenu(state: State.State, actions: State.Actions) {
  let menus: any[] = []
  for (const i in Routes.rawRoutes.children) {
    let route = Routes.rawRoutes.children[i]
    let menu: any = route.children
      .filter(c => c.label)
      .map(c => (
        <Menu.Item
          key={Routes.join(route.path, c.path)}
        >
          <span>{c.label}</span>
        </Menu.Item>
      ))
    if (route.label) {
      menu = (
        <SubMenu
          key={route.path}
          title={route.icon && (
            <span>
              <Icon type={route.icon} /><span>{route.label}</span>
            </span>
          )}
        >
          {menu}
        </SubMenu>
      )
    }
    menus.push(menu)
  }
  return menus
}

function renderBreadcrumb(state: State.State, style: React.CSSProperties = {}) {
  let route = Routes.default.meta[state.location.template || '']
  debug('route', route)
  if (!route) {
    return null
  }
  return (
    <Breadcrumb style={{ margin: '16px 0', ...style }}>
      {route.parents.concat(route).filter(p => p.label).map(p => (
        <Breadcrumb.Item key={p.path}>{p.label}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}

function renderRoutes(state: State.State, actions: State.Actions) {
  switch (state.page) {
    case 'dashboard':
      return 'Dashboard'
    case 'users':
      return <User.View.Root state={state.user} actions={actions.user} />
    default:
      return <div style={{ color: 'red' }}> Unknown route! </div>
  }
}

export const root = (state: State.State) => (actions: State.Actions) => (
  <Layout>
    <Layout>
      <Sider
        style={{ background: '#fff' }}
        trigger={null}
        collapsible
        collapsed={!state.isMenuShow}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[state.location.template || '']}
          defaultOpenKeys={Routes.rawRoutes.children.map(c => Routes.join(Routes.rawRoutes.path, c.path))}
          style={{ height: '100%', borderRight: 0 }}
          onClick={({ item, key }) => {
            actions.history.push(key)
          }}
        >
          {renderMenu(state, actions)}
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <Icon
            className="trigger"
            type={state.isMenuShow ? 'menu-fold' : 'menu-unfold'}
            onClick={_ => actions.showMenu(!state.isMenuShow)}
          />
          xx 后台
        </Header>
        {renderBreadcrumb(state, { paddingLeft: 24 })}
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          {renderRoutes(state, actions)}
        </Content>
      </Layout>
    </Layout>
  </Layout>
)
