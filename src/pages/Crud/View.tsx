import * as React from 'react'
import { Form, Row, Col, Input, Button, Icon, Table, Modal, Spin } from 'antd'
import { ColumnProps } from 'antd/lib/table/interface'
const FormItem = Form.Item
import * as State from './State'
import { Paging } from './Types'
import { setIn, updateIn } from 'hydux-mutator'

export function SearchForm({
  isLoading = false,
  inputs,
  onSearch,
  onReset,
  onCreate,
  colCount = 4,
}: {
  isLoading: boolean,
  inputs: [string, JSX.Element][],
  onSearch?: (e: React.FormEvent<any>) => void,
  onReset?: (e: React.MouseEvent<any>) => void,
  onCreate?: (e: React.MouseEvent<any>) => void,
  colCount?: number,
}) {
  return (
    <Form
      className="ant-advanced-search-form"
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        onSearch && onSearch(e)
      }}
      style={{ marginBottom: 10 }}
    >
      <Row gutter={24}>{
          inputs.map(([label, element], i) => (
            <Col span={24 / colCount} key={i}>
              <FormItem label={label}>
                {element}
              </FormItem>
            </Col>
          ))
        }
        <Col span={24 / colCount} style={{ textAlign: 'right', paddingTop: 40 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}> 搜索</Button>
          <Button style={{ marginLeft: 8 }} onClick={onReset} loading={isLoading}>
            清空
          </Button>
          <Button style={{ marginLeft: 8 }} type="primary" loading={isLoading} onClick={onCreate}>创建</Button>
        </Col>
      </Row>
    </Form>
  )
}

export function DataTable<T, Q>({
  columns,
  paging,
  isLoading,
  onChange,
}: {
  columns: ColumnProps<T>[],
  paging: Paging<T>,
  isLoading: boolean,
  onChange: (paging: Paging<T>) => void,
}) {
  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={paging.list}
      bordered
      pagination={{
        current: Math.floor(paging.start / paging.limit) + 1,
        total: paging.total,
        onChange: (page, pageSize) => {
          const limit = pageSize || paging.limit
          onChange({ ...paging, start: (page - 1) * limit, limit })
        },
      }}
    />
  )
}

export function FormModal({
  title,
  visible,
  isLoading = false,
  onCancel,
  onSubmit,
  inputs,
  className,
  style,
  children,
}: {
  title: string,
  visible: boolean,
  isLoading: boolean,
  style?: React.CSSProperties,
  className?: string,
  inputs?: {
    label: string,
    input: JSX.Element,
    status?: 'success' | 'warning' | 'error' | 'validating',
    help?: string,
    hasFeedback?: boolean,
    required?: boolean,
    className?: string,
    style?: React.CSSProperties,
  }[],
  children?: React.ReactChild,
  onSubmit: (e: React.FormEvent<any>) => void,
  onCancel: (e: any) => void
}) {
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
      className={className}
      style={style}
    >
      {isLoading
        ? (
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '100px 0',
            }}
          >
            <Spin style={{ margin: '0 auto' }} />
          </div>
        )
        : (
          <Form
            onSubmit={e => {
              e.stopPropagation()
              e.preventDefault()
              onSubmit(e)
            }}
          >
            {inputs && inputs.map(({
              label,
              input,
              help,
              status = help ? 'error' : void 0,
              hasFeedback = true,
              required,
              className,
              style,
            }, i) => (
              <FormItem
                key={i}
                label={label}
                validateStatus={status}
                help={help}
                required={required}
                hasFeedback={hasFeedback}
                className={className}
                style={style}
              >
                {input}
              </FormItem>
            ))}
          </Form>
        ) }
        {children}
    </Modal>
  )
}

export function updateField<T, V>(crudState: T, update: (t: T) => void) {
  return (accessor: (e: T) => V) => e =>
    update(setIn(crudState, accessor, e.target ? e.target.value : e))
}
