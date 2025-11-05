import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import '@hexlet/chatbot-v2/styles'

const container = document.getElementById('root')

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
