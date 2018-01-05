import * as State from './State'
import * as React from 'react'
import { View as CrudView } from '../Crud'
import { Input, Popconfirm, Button } from 'antd'
import { setIn, updateIn } from 'hydux-mutator'

export const Root = ({ state, actions }: { state: State.State, actions: State.Actions }) => {
  const { query } = state.crud
  const changeSearch = CrudView.updateField(query, actions.crud.updateQuery)

  const searchInputs: [string, JSX.Element][] = [
    ['ID', <Input key={1} type="text" value={query.id} onChange={changeSearch(_ => _.id)} />],
    ['名字', <Input key={1} type="text" value={query.name} onChange={changeSearch(_ => _.name)} />],
  ]

  const changeForm = CrudView.updateField(state.crud.entity, actions.crud.updateEntity)
  return (
    <div>
      <CrudView.SearchForm
        inputs={searchInputs}
        onSearch={_ => actions.crud.loadList()}
        isLoading={state.crud.isLoadingEntity}
        onCreate={_ => actions.crud.toggleEditDialog([true, ''])}
      />
      <CrudView.DataTable
        columns={[{
          title: 'ID',
          dataIndex: 'id',
        }, {
          title: '名字',
          dataIndex: 'name',
        }, {
          title: '生日',
          dataIndex: 'birthday',
        }, {
          title: 'operation',
          dataIndex: 'operation',
          render: (text, record) => {
            return (
              <div>
                  <Button onClick={_ => actions.crud.toggleEditDialog([true, record.id])}>修改</Button>
                  <Popconfirm
                    title="确定要删除吗?"
                    onConfirm={() => actions.crud.removeOne(record.id)}
                  >
                    <Button
                      type="danger"
                      style={{ marginLeft: 8 }}
                    >
                      删除
                    </Button>
                  </Popconfirm>
              </div>
            )
          },
        }]}
        paging={state.crud.paging}
        isLoading={state.crud.isLoadingList}
        onChange={actions.crud.loadList}
      />
      <CrudView.FormModal
        visible={state.crud.showEditDialog}
        title={'编辑用户'}
        isLoading={state.crud.isLoadingEntity}
        onSubmit={actions.crud.saveOne}
        onCancel={_ => actions.crud.toggleEditDialog([false, state.crud.entity.id])}
        inputs={[{
          label: '用户名',
          input: <Input type="text" value={state.crud.entity.name} onChange={changeForm(_ => _.name)} />,
          help: state.crud.entityErrors.name,
        }, {
          label: '生日',
          input: <Input type="text" value={state.crud.entity.birthday} onChange={changeForm(_ => _.birthday)} />,
          help: state.crud.entityErrors.birthday,
        }]}
      />
    </div>
  )
}
