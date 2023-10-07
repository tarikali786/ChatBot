import "./Home.css";
import UserLogo from "../../assets/profile-img.jpg";
import chatlogo from "../../assets/chat.png";

import { useChatContext } from "../ContextApi/Context";
// import chatlogo from "../../assets/chat2.png";
export const Navbar = () => {
  const { name } = useChatContext();
  return (
    <>
      <div className="navbar">
        <div className="chatBotLogo">
          <img className="logos" src={chatlogo} />
        </div>
        {/* <span className="logos">ChatBot</span> */}

        {/* </img> */}
        <div className="usernameContainer">
          <img className="userLogo" src={UserLogo} alt="" />
          <span className="username">{name?.split(" ")[0]}</span>

          {/* <button className="logoutContainer" type="">
            Logout
          </button> */}
        </div>
      </div>
    </>
  );
};
