import { useEffect, useState } from 'react'
import Post from '../interfaces/post'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import { Button, List, Skeleton } from 'antd'
const POSTS = gql`
  query {
    posts {
      data {
        id
        title
        body
      }
    }
  }
`
export interface PostItemData {
  data: Post[]
}
export interface GetPostQuery {
  posts: PostItemData
}

function Posts() {
  const { loading, error, data, refetch, networkStatus } = useQuery<
    GetPostQuery
  >(POSTS)

  if (networkStatus === NetworkStatus.refetch) return <> 'Refetching!'</>
  if (loading) {
    return <Skeleton />
  }

  return (
    <>
      <Button onClick={() => refetch()}>Reload</Button>
      <List
        itemLayout="horizontal"
        dataSource={data?.posts.data ?? []}
        renderItem={(post) => (
          <List.Item>
            <List.Item.Meta
              title={post.title}
              description={post.body}
              key={post.id}
            />
          </List.Item>
        )}
      />
    </>
  )
}

export default Posts
