import { useState, createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false); //state for mobile layout settings menu
  const [chatUserData, setChatUserData] = useState();
  const [mobileMessageView, setMobileMessageView] = useState(false);
  const [filter, setFilter] = useState("");

  return (
    <UserContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        settingsDialogOpen,
        setSettingsDialogOpen,
        chatUserData,
        setChatUserData,
        mobileMessageView,
        setMobileMessageView,
        filter,
        setFilter,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
