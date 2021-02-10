import { useEffect, useState, createContext } from "react";
import io from "socket.io-client";

const socketIO = io();

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false); //state for mobile layout settings menu
  const [chatUserData, setChatUserData] = useState();
  const [mobileMessageView, setMobileMessageView] = useState(false);
  const [filter, setFilter] = useState("");
  const [socket, setSocket] = useState();
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    setSocket(socketIO);
  }, []);

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
        socket,
        setSocket,
        filter,
        setFilter,
        isChatting,
        setIsChatting,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
