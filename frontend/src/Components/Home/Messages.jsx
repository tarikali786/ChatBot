import useWebSocket, { ReadyState } from "react-use-websocket";
import { useChatContext } from "../ContextApi/Context";
import "./Home.css";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import User from "../../assets/profile-img.jpg";
import Img2 from "../../assets/news-4.jpg";
import More from "../../assets/moreIcon.png";
import Close from "../../assets/close.png";

import { useEffect, useRef, useState } from "react";

export const Messages = () => {
  const { setDetails, name, user_profile, access_token, connectUser } =
    useChatContext();
  const [show, setshow] = useState(null);

  const [message, setMessage] = useState();
  const [messageHistory, setMessageHistory] = useState([]);
  const chatUser = connectUser?.userProfile?.name;
  const conversation_name =
    name <= chatUser ? `${name}__${chatUser}` : `${chatUser}__${name}`;

  const { readyState, sendJsonMessage } = useWebSocket(
    access_token ? `ws://127.0.0.1:8000/${conversation_name}/` : null,

    {
      onOpen: () => {
        console.log("connected");
      },
      onClose: () => {
        console.log("Disconnected");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "welcome_message":
            break;
          case "chat_message_echo":
            setMessageHistory((prev) => prev.concat(data));
            break;
          case "last_50_messages":
            setMessageHistory(data.messages);
            break;
          default:
            console.error("UnKnown Message type");
        }
      },
    }
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  console.log(connectionStatus);

  const handleKeyDown = (e) => {
    if (e && e.key === "0") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    sendJsonMessage({
      type: "chat_message",
      name,
      message,
    });
    setMessage("");
  };
  const chatContainerRef = useRef(null);
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);
  function formatMessageTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString(undefined, options);
  }

  const handleClick = (id) => {
    console.log(id);
    setshow(id);
  };
  return (
    <>
      <div className="wehsocketMessageApi" onClick={() => setDetails(false)}>
        <div className="websocketMessgae" ref={chatContainerRef}>
          {messageHistory?.map(
            (
              message,
              index // Use parentheses for the map function
            ) => (
              <div
                key={index}
                className={`message ${
                  (message.from_user && message.from_user.name === name) ||
                  (message.name && message.name === name)
                    ? "owner"
                    : ""
                }`}
              >
                <div className="messageInfo">
                  {!user_profile ? (
                    <img src={User} alt="" />
                  ) : (
                    <p className="firstLaterNames">
                      {message?.from_user?.name[0] || message?.name[0]}
                    </p>
                  )}
                </div>
                <div className="MessageDisplayConatiner">
                  <p onClick={() => setshow(false)}>
                    {message.content || message?.message.content}{" "}
                    <span className="timeStepConatiner">
                      {formatMessageTimestamp(message.timestamp || new Date())}
                    </span>
                  </p>
                  <div
                    className="moreIconContainer"
                    onClick={() => handleClick(message.id)}
                  >
                    <img src={More} alt="" />
                  </div>

                  {show === message.id && (
                    <div className="saveContainer">
                      <div className="closeIcon" onClick={() => setshow(false)}>
                        <img src={Close} alt="" />
                      </div>
                      <a href={Img2} download>
                        Save
                      </a>
                      <p onClick={() => setshow(false)} className="edit">
                        Edit
                      </p>
                      <p onClick={() => setshow(false)} className="edit">
                        Delete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Input Box */}
        <div className="websocketInputMessage">
          <div className="inputBoxTextArea">
            <textarea
              type=""
              name="message"
              placeholder="Type message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={handleKeyDown}
            />
            <div className="attehedFile">
              <AttachFileIcon className="attechFile" />
              <input
                type="file"
                name=""
                style={{ display: "none" }}
                id="file"
              />
              <label htmlFor="file">
                <AddPhotoAlternateIcon />
              </label>
            </div>
          </div>
          <div className="sendIcon" onClick={handleSubmit}>
            <SendIcon />
          </div>
        </div>
      </div>
    </>
  );
};
