import "./Home.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UserProfile from "../../assets/template_thumb3.png";
import { Messages } from "./Messages";
import { Input } from "./Input";
import { MoreDetails } from "./MoreDetails";
import { useChatContext } from "../ContextApi/Context";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import chatBot from "../../assets/chat.png";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie library

export const Chat = () => {
  const { details, setDetails, connectUser, setaccess_token } =
    useChatContext();
  // console.log(details);
  const handleMoreDetails = (e) => {
    e.stopPropagation();

    setDetails(!details);
  };

  const handleSignOut = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/user/logout/");

      if (response.status === 200) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        // Set details to false
        setDetails(false);
        console.log("user log out");
        setaccess_token("");
        // You may also want to clear any other user-related data here
      } else {
        // Handle logout failure here
        console.error("Logout failed");
      }
    } catch (error) {
      // Handle any sign-out errors here
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {connectUser.userProfile ? (
        <div className="chat">
          <div className="chatInfo" onClick={() => setDetails(false)}>
            <div className="chatuserProfile">
              {connectUser?.userProfile?.profile_image ? (
                <img className="userLogos" src={UserProfile} alt="" />
              ) : (
                <span className="firstLaterNameProfile">
                  {connectUser?.userProfile?.name[0]}
                </span>
              )}
              <div className="onlineuserchat">
                <span className="chatUser">
                  {connectUser?.userProfile?.name}
                </span>
                {connectUser?.userProfile?.is_active ? (
                  <span>online</span>
                ) : (
                  <p className="lastLogin">12:00AM</p>
                )}
              </div>
            </div>
            <div className="chatIcon">
              <AddIcCallIcon className="activeIcon" />
              <VideocamIcon className="activeIcon" />
              <PersonAddIcon className="activeIcon" />
              <MoreHorizIcon
                className="moreDetails activeIcon"
                onClick={handleMoreDetails}
              />
            </div>
          </div>
          {details && <MoreDetails />}
          <Messages />
          {/* <Input /> */}
        </div>
      ) : (
        <div className="chat defaultChat">
          <div className="chatBotLogosss">
            <div className="chatLogosbat">
              <img src={chatBot} alt="" />
            </div>
            <p className="chatBotname">ChatBot</p>
          </div>
          <h1 className="slogoTitle">
            Connecting Conversations: Your All-in-One Chat and Call Companion{" "}
          </h1>
          <p className="logoutButton" onClick={handleSignOut}>
            Logout
          </p>
        </div>
      )}
    </>
  );
};
