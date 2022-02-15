import { gql, NetworkStatus, useLazyQuery, useQuery } from '@apollo/client'
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Skeleton,
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

export interface OutletFilter {
  code: string | null
  name: string | null
}

function Outlets() {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  })
  const [isBtnSearchLoading, setIsBtnSearchLoading] = useState<boolean>(false)
  const [
    loadOutlets,
    { loading, error, data, networkStatus, fetchMore },
  ] = useLazyQuery<OutletQueryResult>(GET_OUTLETS, {
    variables: {
      pagination: {
        skip: 0,
        take: pagination.pageSize,
      },
    },
  })
  useEffect(() => {
    loadOutlets()
  }, [])
  useEffect(() => {
    setPagination({
      ...pagination,
      total: data?.outlets.count ?? 0,
    })
  }, [data])

  const onFinish = (values: OutletFilter) => {
    console.log('Success:', values)
    // setIsBtnSearchLoading(true)
    loadOutlets({
      variables: {
        pagination: {
          where: [
            {
              code: {
                contains: values.code,
              },
            },
          ],
        },
      },
    })
    // setIsBtnSearchLoading(false)
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isBtnSearchLoading}
                >
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
          const skip = ((e.current ?? 1) - 1) * (e.pageSize ?? 0)
          loadOutlets({
            variables: {
              pagination: {
                skip: skip,
                take: e.pageSize ?? 5,
              },
            },
          })
          setPagination({
            ...pagination,
            current: e.current ?? 1,
            pageSize: e.pageSize ?? 5,
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
      />
    </>
  )
}

export default Outlets
