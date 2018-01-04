import * as React from 'react'
import { Form, Row, Col, Input, Button, Icon, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table/interface'
const FormItem = Form.Item
import * as State from './State'

export function SearchForm({
  inputs,
  onSearch,
  onReset
}: {
  inputs: [string, JSX.Element][],
  onSearch?: (e: React.FormEvent<any>) => void,
  onReset?: (e: React.MouseEvent<any>) => void,
}) {
  return (
    <Form
      className="ant-advanced-search-form"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        onSearch && onSearch(e)
      }}
    >
      <Row gutter={24}>{
        inputs.map(([label, element], i) => (
          <Col span={8} key={i}>
            <FormItem label={label}>
              {element}
            </FormItem>
          </Col>
        ))
      }</Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit"> 搜索</Button>
          <Button style={{ marginLeft: 8 }} onClick={onReset}>
            清空
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export function DataTable<T, Q>({
  columns,
  dataSource,
  paging,
}: {
  columns: ColumnProps<T>[],
  dataSource: T[],
  paging: State.Paging<T, Q>,
}) {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={{
        current: Math.floor(paging.start / paging.limit) + 1,
        total: Math.ceil(paging.total / paging.limit),
        onChange: page => {}
      }}
    />
  )
}
