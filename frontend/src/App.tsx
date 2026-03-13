import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MealsPage from './pages/MealsPage';
import IngredientsPage from './pages/IngredientsPage';
import WeeklyPlannerPage from './pages/WeeklyPlannerPage';
import NotificationsPage from './pages/NotificationsPage';
import ShoppingListPage from './pages/ShoppingListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Feature Pages (Now Publicly Browsable) */}
              <Route path="/meals" element={<MealsPage />} />
              <Route path="/ingredients" element={<IngredientsPage />} />
              <Route path="/planner" element={<WeeklyPlannerPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/shopping" element={<ShoppingListPage />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
