import { Button, Checkbox, Form, Input } from 'antd'
import axios from 'axios'
import LoginResultSuccess from '../interfaces/loginResultSuccess'
import { setToLocalStorage } from '../util/helper'

function Login() {
  const onFinish = async (values: any) => {
    const request = await axios.post<LoginResultSuccess>(
      'https://reqres.in/api/login',
      values,
    )
    if (request.status === 200 && request?.data?.token) {
      setToLocalStorage('token', request.data.token)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        username: 'eve.holt@reqres.in',
        password: 'admin',
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
