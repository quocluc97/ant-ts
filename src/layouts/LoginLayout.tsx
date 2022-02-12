import React from 'react'
import { Outlet } from 'react-router-dom'
import loginBackground from '../assets/loginBackground.svg'
function LoginLayout() {
  return (
    <div
      style={{
        // backgroundImage: `url(${loginBackground})`,
        width: '100%',
        height: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            // border: '1px solid #ccc',
            padding: '1rem',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LoginLayout
