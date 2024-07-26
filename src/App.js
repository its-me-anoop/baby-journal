// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ParentPage from './pages/ParentPage';
import CarerPage from './pages/CarerPage';
import FamilyPage from './pages/FamilyPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/carer" element={<CarerPage />} />
          <Route path="/family" element={<FamilyPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
