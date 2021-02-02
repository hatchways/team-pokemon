import { useState, createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardDialogOpen, setDashboardDialogOpen] = useState(false); //state for mobile layout dashboard menu
  const [chatUserData, setChatUserData] = useState();
  const [mobileMessageView, setMobileMessageView] = useState(false);

  return (
    <UserContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        dashboardDialogOpen,
        setDashboardDialogOpen,
        chatUserData,
        setChatUserData,
        mobileMessageView,
        setMobileMessageView,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
