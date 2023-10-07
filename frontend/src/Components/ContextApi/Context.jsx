import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [details, setDetails] = useState(false);
  const [access_token, setaccess_token] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectUser, setConnectUser] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  const { userID, name, user_profile, email } = useMemo(() => {
    const userJSON = localStorage.getItem("user");
    return userJSON ? JSON.parse(userJSON) : {};
  }, [access_token]);

  useEffect(() => {
    setaccess_token(Cookies.get("access_token"));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        details,
        setDetails,
        name,
        userID,
        user_profile,
        access_token,
        setaccess_token,
        loading,
        setLoading,
        connectUser,
        setConnectUser,
        roomName,
        setRoomName,
        message,
        setMessage,
        messageHistory,
        setMessageHistory,
        email,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
