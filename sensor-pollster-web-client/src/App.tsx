import React, { useState, useEffect } from 'react'
import './App.css'

import AppRouter from './AppRouter'
import { Typography } from '@material-ui/core'

class AuthState {
  checkedAuthentication = false
  authenticated = false
  authUrl = ''
}

export default function App() {
  const [authState, setAuthState] = useState(new AuthState())
  const updateAuthState = () => setAuthState({ ...authState })

  useEffect(() => {
    // if not checked auth yet, check
    if (!authState.checkedAuthentication) {
      (async () => {
        const auth = await (await fetch('/api/user/auth')).json()
        authState.checkedAuthentication = true
        authState.authenticated = auth.authenticated
        authState.authUrl = auth.url
        updateAuthState()
      })()
    }
  })

  if (authState.authenticated) {
    return (<div id="app">
      <AppRouter authenticated={true}></AppRouter>
    </div>)
  }

  let title = ""
  let msg = <Typography variant="body1">Sit and relax</Typography>
  if (!authState.checkedAuthentication) {
    title = "Checking authentication"
  }
  else {
    if (!authState.authenticated) {
      title = "Login required"
      msg = <Typography variant="body1">Click <a href={authState.authUrl}>here</a> to login via OAuth provider.</Typography>
    }
  }

  return (<div id="app">
    <AppRouter authenticated={false} title={title} content={msg} />
  </div>)
}