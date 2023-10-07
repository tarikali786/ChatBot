import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useChatContext } from "../ContextApi";
import "./Home.css";
export const Message = () => {
  const { name } = useChatContext();
  const [message, setmessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]); // Initialize as an empty array
  const { sendJsonMessage } = useWebSocket("ws://127.0.0.1:8000/");
  const { readyState } = useWebSocket("ws://127.0.0.1:8000/", {
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
        default:
          console.error("Unknown message type!");
      }
    },
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handleCHanegeMeasage = (e) => {
    setmessage(e.target.value);
  };
  const handleSumbit = (e) => {
    e.preventDefault();

    sendJsonMessage({
      type: "chat_message",
      message,
      name,
    });
    setmessage("");
  };

  return (
    <div className="ChatWebsocketConatiner">
      <p>The websocket is currentlyu {connectionStatus}</p>
      <div className="ChatWebSocketMEssage">
        {messageHistory.map(
          (
            message,
            index // Use parentheses for the map function
          ) => (
            <p key={index}>
              {message.name} {message.message}
            </p>
          )
        )}
      </div>

      <form onSubmit={handleSumbit} className="InputChatContainer">
        <input
          type="text" // Correct the type attribute for the input elements
          name="message"
          value={message}
          placeholder="enter message"
          onChange={handleCHanegeMeasage}
        />
        <button type="submit" onClick={handleSumbit}>
          Submit
        </button>{" "}
        {/* Add type="submit" for the button */}
      </form>
    </div>
  );
};
