import { gql, NetworkStatus, useLazyQuery, useQuery } from '@apollo/client'
import { Skeleton, Table, TablePaginationConfig } from 'antd'
import React, { useEffect, useState } from 'react'

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

function Outlets() {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  })
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

  if (networkStatus === NetworkStatus.refetch) return <> 'Refetching!'</>
  if (loading) {
    return <Skeleton />
  }
  return (
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
          title: 'Id',
          key: 'id',
          dataIndex: 'id',
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
    />
  )
}

export default Outlets
