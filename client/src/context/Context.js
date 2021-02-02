import { useState, createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false); //state for mobile layout settings menu

  return (
    <UserContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        settingsDialogOpen,
        setSettingsDialogOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
