import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import Home from './pages/Home';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/"  element={<Home/>}/>
          
          <Route path="*" element={<Navigate to="/"/>} />

        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App;
