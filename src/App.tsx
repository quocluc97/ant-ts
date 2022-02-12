import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginLayout from './layouts/LoginLayout'

import Lists from './pages/Lists'
import Tables from './pages/Tables'
import Posts from './pages/Posts'

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import Login from './pages/Login'

const httpLink = createHttpLink({
  uri: 'https://graphqlzero.almansi.me/api',
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Lists />} />
            <Route path="tables" element={<Tables />} />
            <Route path="posts" element={<Posts />} />
          </Route>
          <Route path="/login" element={<LoginLayout />}>
            <Route index element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
