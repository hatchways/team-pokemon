import { useState, createContext } from "react";

export const UserContext = createContext();

export default ({ children }) => {
  const [user, setUser] = useState(null); //set based on API call response
  const [isAuthenticated, setIsAuthenticated] = useState(true); //set based on API call response
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
