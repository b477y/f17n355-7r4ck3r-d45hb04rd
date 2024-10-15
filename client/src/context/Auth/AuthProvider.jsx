import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const USERNAME_KEY = "username";
const TOKEN_KEY = "token";

const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem(USERNAME_KEY));
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));

  // Determine if user is authenticated
  const isAuthenticated = !!token;

  const login = (username, token) => {
    setUsername(username);
    setToken(token);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = () => {
    // Clear local storage and state
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUsername(null);
    setToken(null);
  };

  // Effect to synchronize state with local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (storedUsername && storedToken) {
      setUsername(storedUsername);
      setToken(storedToken);
    } else {
      logout(); // Ensure logout if no token
    }
  }, []);

  return (
    <AuthContext.Provider value={{ username, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
