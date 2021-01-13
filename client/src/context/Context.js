import { useState, createContext } from "react";

export const UserContext = createContext();

export default ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
