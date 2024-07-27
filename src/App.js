import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { useAuth } from './hooks/useAuth';

// Importing components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import FamilyPage from './pages/FamilyPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import UserProfile from './components/Profiles/UserProfile';
import ChildrenList from './components/Profiles/ChildrenList';
import ChildProfile from './components/Profiles/ChildProfile';
import FamilySettingsPage from './pages/FamilySettingsPage'; // Import the new FamilySettingsPage component

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// AdminRoute component
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <FamilyProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
              <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/children/:familyId" element={<ChildrenList />} />
                  <Route path="/child/:childId" element={<ChildProfile />} />
                  <Route
                    path="/journal/:familyId"
                    element={
                      <PrivateRoute>
                        <JournalPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard/:familyId"
                    element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/family"
                    element={
                      <PrivateRoute>
                        <FamilyPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/family-settings/:familyId"
                    element={
                      <PrivateRoute>
                        <FamilySettingsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </FamilyProvider>
    </AuthProvider>
  );
}

export default App;