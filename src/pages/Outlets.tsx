import { gql, NetworkStatus, useLazyQuery, useQuery } from '@apollo/client'
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Skeleton,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import React, { useEffect, useRef, useState } from 'react'

const GET_OUTLETS = gql`
  query Outlets($pagination: ViewOutletEntityPaginationInput) {
    outlets(pagination: $pagination) {
      count
      entities {
        code
        name
        id
      }
    }
  }
`

export interface OutletQueryResultEntity {
  id: number
  code: string
  name: string
}
export interface OutletQueryResultData {
  count: number
  entities: OutletQueryResultEntity[]
}
export interface OutletQueryResult {
  outlets: OutletQueryResultData
}

export interface OutletFilterInput {
  code?: string
  name?: string
}

export class FilterOptions<T> {
  public contains?: T
}

export class FilterOptionsString extends FilterOptions<string> {}

export interface OutletQueryFilerInput {
  code?: FilterOptionsString
  name?: FilterOptionsString
}

export class QueryPaginationInput {
  public take? = 10
  public skip? = 0
  public where?: OutletQueryFilerInput[]
}
function Outlets() {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  })
  const [fitler, setFilter] = useState<OutletQueryFilerInput>({})
  const [queryPagination, setQueryPagination] = useState<QueryPaginationInput>(
    {},
  )
  const [
    loadOutlets,
    { loading, error, data, networkStatus, fetchMore },
  ] = useLazyQuery<OutletQueryResult>(GET_OUTLETS, {
    variables: {
      pagination: queryPagination,
    },
  })
  useEffect(() => {
    loadOutlets()
  }, [queryPagination])

  useEffect(() => {
    setPagination({
      ...pagination,
      total: data?.outlets.count ?? 0,
    })
  }, [data])

  const onFinish = (values: OutletFilterInput) => {
    setQueryPagination({
      where: [
        {
          code: {
            contains: values.code ?? '',
          },
          name: {
            contains: values.name ?? '',
          },
        },
      ],
      take: pagination.pageSize,
      skip: 0,
    })
    setPagination({
      ...pagination,
      current: 1,
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <>
      <div>
        <Divider orientation="left" plain>
          Filter
        </Divider>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Code" name="code">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Outlet name" name="name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit" loading={loading}>
                  <SearchOutlined />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider />
      </div>

      <Table
        dataSource={data?.outlets?.entities}
        pagination={pagination}
        onChange={(e) => {
          setPagination({
            ...pagination,
            current: e.current ?? 1,
            pageSize: e.pageSize ?? 5,
          })
          setQueryPagination({
            ...queryPagination,
            take: e.pageSize,
            skip: ((e.current ?? 1) - 1) * (e?.pageSize ?? 10),
          })
        }}
        columns={[
          {
            title: '#',
            render: (text, record, index) => {
              return (
                ((pagination.current ?? 0) - 1) * (pagination.pageSize ?? 5) +
                index +
                1
              )
            },
          },
          {
            title: 'Code',
            key: 'code',
            dataIndex: 'code',
          },
          {
            title: 'Outlet Name',
            key: 'name',
            dataIndex: 'name',
          },
        ]}
        loading={loading}
        rowKey="id"
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {pagination.total}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </>
  )
}

export default Outlets
