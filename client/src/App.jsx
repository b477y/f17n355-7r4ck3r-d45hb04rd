import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
<<<<<<< HEAD
=======
import HealthForm from "./pages/HealthForm"; // Import the HealthForm page
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
import AuthProvider from "./context/Auth/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/Auth/AuthContext"; // Import useAuth

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected home page route */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
<<<<<<< HEAD
          
=======

          {/* Protected health form page */}
          <Route path="/health-form" element={<ProtectedRoute><HealthForm /></ProtectedRoute>} />

>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
          {/* Redirect to home if already authenticated */}
          <Route 
            path="/register" 
            element={<RedirectToHome path="/register" />} 
          />
          <Route 
            path="/login" 
            element={<RedirectToHome path="/login" />} 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const RedirectToHome = ({ path }) => {
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from context

  return isAuthenticated ? <Navigate to="/" /> : (path === "/register" ? <RegisterPage /> : <LoginPage />);
};

export default App;
