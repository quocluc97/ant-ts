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
  InMemoryCache,
} from '@apollo/client'
import React, { useContext, createContext, useState } from 'react'
import { setContext } from '@apollo/client/link/context'
import Login from './pages/Login'
import Outlets from './pages/Outlets'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
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
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,
            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...existing, ...incoming]
            },
          },
        },
      },
    },
  }),
})

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true
    setTimeout(callback, 100) // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false
    setTimeout(callback, 100)
  },
}
interface AuthContextType {
  user: any
  signin: (user: string, callback: VoidFunction) => void
  signout: (callback: VoidFunction) => void
}

const AuthContext = createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = useState<any>(null)

  let signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser)
      callback()
    })
  }

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null)
      callback()
    })
  }

  let value = { user, signin, signout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
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
