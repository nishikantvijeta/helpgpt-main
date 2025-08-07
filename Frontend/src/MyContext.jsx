import { createContext } from "react";
export const MyContext = createContext({
  // ...existing values,
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  showLogin: false,
  setShowLogin: () => {},
  showRegister: false,
  setShowRegister: () => {},
});