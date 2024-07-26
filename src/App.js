import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Import pages
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

// Import components
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// PrivateRoute component
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

// AdminRoute component
const AdminRoute = ({ component: Component, ...rest }) => {
  const { user, isAdmin } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        user && isAdmin ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <PrivateRoute path="/journal" component={JournalPage} />
              <PrivateRoute path="/dashboard" component={DashboardPage} />
              <AdminRoute path="/admin" component={AdminPage} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;