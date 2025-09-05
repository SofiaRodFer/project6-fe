import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
// Importe o ThemeProvider, createTheme e CssBaseline do Material-UI
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Crie o tema escuro aqui
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        {/* Envolva toda a aplicação com o ThemeProvider */}
        <ThemeProvider theme={darkTheme}>
          <CssBaseline /> {/* Garante um estilo base consistente */}
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)