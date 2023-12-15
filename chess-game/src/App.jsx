import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/"  element={<Home/>}/>
          <Route path="/game"  element={<Game/>}/>  

          <Route path="*" element={<Navigate to="/"/>} />

        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App;
