import "./Home.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useChatContext } from "../ContextApi/Context";
import useWebSocket from "react-use-websocket";
export const Input = () => {
  const { setDetails, message, name, setMessage } = useChatContext();
  const { sendJsonMessage } = useWebSocket("ws://127.0.0.1:8000/");
  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessage("");
    if (!message) return;
    sendJsonMessage({
      type: "chat_message",
      message,
      name,
    });
  };
  return (
    <>
      <form
        onSubmit={handleSendMessage}
        className="inputContainerField"
        onClick={() => setDetails(false)}
      >
        <div className="inputContain">
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            className="chatInput"
            placeholder="Type Messages"
            value={message}
            name="message"
          ></textarea>
          <div className="attehedFile">
            <AttachFileIcon className="attechFile" />
            <input type="file" name="" style={{ display: "none" }} id="file" />
            <label htmlFor="file">
              <AddPhotoAlternateIcon />
            </label>
          </div>
        </div>

        <div className="sendIcon">
          <SendIcon onClick={handleSendMessage} />
        </div>
      </form>
    </>
  );
};
