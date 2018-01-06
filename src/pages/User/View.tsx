import * as State from './State'
import * as React from 'react'
import { View as CurdView } from '../Curd'
import { Input, Popconfirm, Button } from 'antd'
import { setIn, updateIn } from 'hydux-mutator'

export const Root = ({ state, actions }: { state: State.State, actions: State.Actions }) => {
  const { query } = state.curd
  const changeSearch = CurdView.updateField(query, actions.curd.updateQuery)

  const searchInputs: [string, JSX.Element][] = [
    ['ID', <Input key={1} type="text" value={query.id} onChange={changeSearch(_ => _.id)} />],
    ['名字', <Input key={1} type="text" value={query.name} onChange={changeSearch(_ => _.name)} />],
  ]

  const changeForm = CurdView.updateField(state.curd.entity, actions.curd.updateEntity)
  return (
    <div>
      <CurdView.SearchForm
        inputs={searchInputs}
        onSearch={_ => actions.curd.loadList()}
        isLoading={state.curd.isLoadingEntity}
        onCreate={_ => actions.curd.toggleEditDialog([true, ''])}
        onReset={_ => {
          actions.curd.updateQuery(State.emptyQuery())
          actions.curd.loadList()
        }}
      />
      <CurdView.DataTable
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
          title: '操作',
          dataIndex: '___operation',
          render: (text, record) => {
            return (
              <div>
                  {/* <Button onClick={_ => actions.curd.toggleShowDialog([true, record.id])}>查看</Button> */}
                  <Button onClick={_ => actions.curd.toggleEditDialog([true, record.id])}>修改</Button>
                  <Popconfirm
                    title="确定要删除吗?"
                    onConfirm={() => actions.curd.removeOne(record.id)}
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
        paging={state.curd.paging}
        isLoading={state.curd.isLoadingList}
        onChange={actions.curd.loadList}
      />
      <CurdView.FormModal
        visible={state.curd.showEditDialog}
        title={'编辑用户'}
        isLoading={state.curd.isLoadingEntity}
        onSubmit={actions.curd.saveOne}
        onCancel={_ => actions.curd.toggleEditDialog([false, state.curd.entity.id])}
        inputs={[{
          label: '用户名',
          input: <Input type="text" value={state.curd.entity.name} onChange={changeForm(_ => _.name)} />,
          help: state.curd.entityErrors.name,
        }, {
          label: '生日',
          input: <Input type="text" value={state.curd.entity.birthday} onChange={changeForm(_ => _.birthday)} />,
          help: state.curd.entityErrors.birthday,
        }]}
      />
    </div>
  )
}
