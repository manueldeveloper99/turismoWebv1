import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="57063760649-7bndboevdute7ejlotmfinnim6rfte7e.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
