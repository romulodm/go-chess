import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from '@mui/system';
import { theme } from './theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Analytics/>
    
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </>
)
