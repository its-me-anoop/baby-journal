// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/parent" component={ParentPage} />
          <Route path="/carer" component={CarerPage} />
          <Route path="/family" component={FamilyPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
