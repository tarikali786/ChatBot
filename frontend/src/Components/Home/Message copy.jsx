import useWebSocket, { ReadyState } from "react-use-websocket";
import { useChatContext } from "../ContextApi/Context";
import "./Home.css";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import User from "../../assets/profile-img.jpg";
import Img2 from "../../assets/news-4.jpg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useRef } from "react";
export const Messages = () => {
  const {
    setDetails,
    name,
    message,
    setMessage,
    messageHistory,
    setMessageHistory,
    user_profile,
    access_token,
    connectUser,
    email,
  } = useChatContext();

  const chatUser = connectUser?.userProfile?.name;
  const conversationName = `${name}__${chatUser}`;

  const { readyState, sendJsonMessage } = useWebSocket(
    access_token ? `ws://127.0.0.1:8000/${conversationName}/` : null,
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
            // setmessage(data.message);
            break;
          case "chat_message_echo":
            // Use concat to add new messages to the messageHistory array
            setMessageHistory((prev) => prev.concat(data));
            break;
          case "last_50_messages":
            setMessageHistory(data.messages);
            break;
          default:
            console.error("Unknown message type!");
        }
      },
    }
  );

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  // }[readyState];

  // console.log(connectionStatus);

  const handleSendMessage = () => {
    if (!message) return;
    sendJsonMessage({
      type: "chat_message",
      message,
      name,
    });
    setMessage("");
  };
  const handleKeyDown = (e) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  function formatMessageTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 5);
  }

  const chatContainerRef = useRef(null);
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);
  console.log(messageHistory);
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
                  message.from_user.name === name ? "owner" : ""
                }`}
              >
                <div className="messageInfo">
                  {!user_profile ? (
                    <img src={User} alt="" />
                  ) : (
                    <p className="firstLaterNames">
                      {message?.from_user?.name[0]}
                    </p>
                  )}
                  <span>
                    {" "}
                    {formatMessageTimestamp(message.timestamp).slice(0, -1)}
                  </span>
                </div>
                <div className="messageContent">
                  <p>{message.content}</p>

                  {/* <div className="imageContainer">
                    <img
                      src={Img2}
                      alt="Image"
                      onClick={() => setshow(false)}
                    />
                    <MoreHorizIcon
                      onClick={() => setshow(!show)}
                      className="chatEdit"
                    />

                    {show && (
                      <div
                        className="saveContainer"
                        onClick={() => setshow(false)}
                      >
                        <a href={Img2} download>
                          Save
                        </a>
                        <span onClick={() => setshow(false)} className="edit">
                          Edit
                        </span>
                        <span onClick={() => setshow(false)} className="edit">
                          Delete
                        </span>
                      </div>
                    )}
                  </div> */}
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
          <div className="sendIcon" onClick={handleSendMessage}>
            <SendIcon />
          </div>
        </div>
      </div>
    </>
  );
};
