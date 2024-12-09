import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrittureUploadPage from './scrittureUploadPage.jsx';
import SimplePage from './Tests/SimplePage.jsx';
import SinglePage from './singlePage/SinglePage.jsx';
import { ThemeProvider } from '@mui/material';
import kpmgTheme from './fonts/theme.js';

// Ensure you are using ReactDOM.createRoot for React 18
const root = createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={kpmgTheme}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScrittureUploadPage />} />
          <Route path="/singlePage" element={<SinglePage />} />
          <Route path="/test" element={<SimplePage />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </ThemeProvider>
);
