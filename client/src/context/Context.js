import { useState, createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); //set based on API call response
  const [isAuthenticated, setIsAuthenticated] = useState(true); //set based on API call response
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardDialogOpen, setDashboardDialogOpen] = useState(false); //state for mobile layout dashboard menu

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        mobileMenuOpen,
        setMobileMenuOpen,
        dashboardDialogOpen,
        setDashboardDialogOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
