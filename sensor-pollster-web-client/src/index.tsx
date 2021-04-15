import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core'

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <ThemeProvider theme={createMuiTheme({
        typography: {
          button: {
            textTransform: "none"
          }
        }
      })}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
)
