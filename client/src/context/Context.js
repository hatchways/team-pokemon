import { useState, createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardDialogOpen, setDashboardDialogOpen] = useState(false); //state for mobile layout dashboard menu

  return (
    <UserContext.Provider
      value={{
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
