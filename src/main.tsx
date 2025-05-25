// src/main.tsx
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/user';
import { ExcelProvider } from './context/ExcelContext';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <ExcelProvider>
        <App />
      </ExcelProvider>
    </AuthProvider>
  </BrowserRouter>
);
