import React from 'react';
import {BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Home from './pages/home/home';

const App: React.FC = () => {
  return (
    <Router basename="/LiteMark">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
            </Routes>
    </Router>
  );
};

export default App;
