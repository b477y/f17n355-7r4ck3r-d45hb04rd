import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  username: null,
  token: null,
  login: () => {},
  logout: () => {}, // Include the logout function
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);
