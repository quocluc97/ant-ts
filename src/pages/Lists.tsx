import { List, Typography, Divider, Button, } from 'antd'
import { useState, useEffect } from 'react'
import axios from 'axios'

export interface TotoItem {
  id: number
  userId: number
  title: string
  completed: boolean
}

export default function Lists() {
  const [listTotoItem, setListTodoItem] = useState<TotoItem[]>([])
  const getData = async () => {
    const data = await axios.get('https://jsonplaceholder.typicode.com/posts')
    setListTodoItem(data.data)
  }
  useEffect(() => {
    getData()
  }, [])
  const reload = () => {
    getData()
  }

  return (
    <div>
      <Divider orientation="left">Large Size</Divider>
      <Button type="primary" onClick={reload}>
        Reload
      </Button>
      <List
        size="large"
        bordered={true}
        dataSource={listTotoItem}
        renderItem={(item) => <List.Item>{item.title}</List.Item>}
      />
    </div>
  )
}
