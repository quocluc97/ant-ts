import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginLayout from './layouts/LoginLayout'

import Lists from './pages/Lists'
import Tables from './pages/Tables'
import Posts from './pages/Posts'

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
} from '@apollo/client'
import React, { useContext, createContext, useState } from 'react'
import { setContext } from '@apollo/client/link/context'
import Login from './pages/Login'
import Outlets from './pages/Outlets'
import {
  getLocalStorage,
  getUserLogin,
  removeLocalStorageItem,
  removeUserLogin,
  setToLocalStorage,
  setUserLogin,
} from './util/helper'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
})
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          // Apollo Server sets code to UNAUTHENTICATED
          case 'UNAUTHENTICATED':
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  },
)

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const userLogin = getUserLogin()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: userLogin ? `Bearer ${userLogin.token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
})

const authProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    authProvider.isAuthenticated = true
    callback()
  },
  signout(callback: VoidFunction) {
    authProvider.isAuthenticated = false
    removeUserLogin()
    callback()
  },
}

export interface UserLogin {
  username: string
  displayName: string
  token: string
  role: string
}
interface AuthContextType {
  user: UserLogin | null
  signin: (user: UserLogin, callback: VoidFunction) => void
  signout: (callback: VoidFunction) => void
}

const AuthContext = createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = useState<UserLogin | null>(getUserLogin())

  let signin = (newUser: UserLogin, callback: VoidFunction) => {
    return authProvider.signin(() => {
      setUserLogin(newUser)
      setUser(newUser)
      callback()
    })
  }

  let signout = (callback: VoidFunction) => {
    return authProvider.signout(() => {
      setUser(null)
      callback()
    })
  }

  let value = { user, signin, signout }

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

function AuthStatus() {
  let auth = useAuth()
  let navigate = useNavigate()

  if (!auth.user) {
    return <p>You are not logged in.</p>
  }

  return (
    <p>
      Welcome {auth.user}!{' '}
      <button
        onClick={() => {
          auth.signout(() => navigate('/'))
        }}
      >
        Sign out
      </button>
    </p>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth()
  let location = useLocation()

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  <RequireAuth>
                    <Lists />
                  </RequireAuth>
                }
              />
              <Route
                path="tables"
                element={
                  <RequireAuth>
                    <Tables />
                  </RequireAuth>
                }
              />
              <Route
                path="posts"
                element={
                  <RequireAuth>
                    <Posts />
                  </RequireAuth>
                }
              />
              <Route
                path="outlets"
                element={
                  <RequireAuth>
                    <Outlets />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/login" element={<LoginLayout />}>
              <Route index element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </AuthProvider>
  )
}

export default App
