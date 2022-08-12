import React from 'react'
import ReactDOM from 'react-dom'
import { SnackbarProvider } from 'notistack'
import App from './app.jsx'

ReactDOM.render(
  <SnackbarProvider maxSnack={5}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </SnackbarProvider>,
  document.getElementById('root')
)
