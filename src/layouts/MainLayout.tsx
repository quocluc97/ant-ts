import { Layout, Menu, Breadcrumb, Button } from 'antd'
import { Fragment } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
const { Header, Content, Footer } = Layout
const listMenuItems = [
  {
    id: 1,
    key: '1',
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    key: '2',
    title: 'Table',
    link: '/tables',
  },
  {
    id: 3,
    key: '3',
    title: 'Posts',
    link: '/posts',
  },
  {
    id: 4,
    key: '4',
    title: 'Outlets',
    link: '/outlets',
  },
]

function MainLayout() {
  const auth = useAuth()
  const navigate = useNavigate()
  console.log('auth', auth)
  const logout = () => {
    auth.signout(() => {
      navigate('/login')
    })
  }
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          {listMenuItems.map((item) => {
            return (
              <Menu.Item key={item.key}>
                <Link to={item.link} key={item.key}>
                  {item.title}
                </Link>
              </Menu.Item>
            )
          })}
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div>
          User: {auth.user?.displayName}{' '}
          <Button onClick={logout}>Logout</Button>
        </div>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}

export default MainLayout
