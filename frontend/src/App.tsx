import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import MealsPage from './pages/MealsPage';
import IngredientsPage from './pages/IngredientsPage';
import WeeklyPlannerPage from './pages/WeeklyPlannerPage';
import NotificationsPage from './pages/NotificationsPage';
import ShoppingListPage from './pages/ShoppingListPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<WeeklyPlannerPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/planner" element={<WeeklyPlannerPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
