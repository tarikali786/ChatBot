import "./Home.css";
import UserProfile from "../../assets/template_thumb3.png";
import { useEffect, useState } from "react";
import { useChatContext } from "../ContextApi";
import axios from "axios";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export const Chats = ({ findUser }) => {
  const [friendList, setFriendList] = useState([]);
  const { access_token, loading, setLoading, setConnectUser, setRoomName } =
    useChatContext();
  const getFriendList = async () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/chat/getFriends/",
        {},
        {
          headers: headers,
        }
      );
      setFriendList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friend list:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getFriendList();
  }, [findUser]);
  if (loading) {
    return <p className="loadingChatsF" />;
  }

  const getRandomColor = () => {
    const colors = [
      "#a45d8e",
      "#442929",
      "#c06b6b",
      "#442d42",
      "#c46cbf",
      "#194460",
      "#57798f",
      "#e66dbf",
      "#c06de6",
      "#a637d9 ",
      "#703ddc ",
      "#563d8c ",
      "#4f52ba ",
      "#4f68ba ",
      "#4c7fb2 ",
      "#50a0b3 ",
      "#50b39e ",
      "#50b386 ",
      "#50b365 ",
      "#5ebb59 ",
      "#80bb59 ",
      "#a4bb59 ",
      "#b1bb59 ",
      "#bba759 ",
      "#bb9459 ",
      "#bb8259 ",
      "#bb7159 ",
      "#bb5959 ",
      "#5545bd ",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // const handleDeleteUser = (e) => {
  //   e.stopPropagation();
  //   setShowDelete(!showDelete);
  // };
  const handleChatConnectUser = async (userID, roomID) => {
    setRoomName(roomID);
    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/user/userProfile/${userID}/`,
        {
          headers: headers,
        }
      );
      setConnectUser(response.data);
      // Do something with the response data here
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };

  return (
    <div className="friendListContainer">
      {friendList?.friends_info?.map((friend) => (
        <div
          className="UserChat"
          key={friend.userid}
          onClick={() => handleChatConnectUser(friend.userid, friend.roomID)}
        >
          {friend.image_profile ? (
            <img className="userLogoss" src={UserProfile} alt="" />
          ) : (
            <span
              className="firstLaterName"
              style={{ backgroundColor: getRandomColor() }}
            >
              {friend?.name[0]}
            </span>
          )}
          <div className="usernameDetails">
            <div className="userChatInfo">
              <span className="chatUserName">{friend?.name}</span>
              <p className="msgContainer">hello</p>
            </div>
            <MoreHorizIcon
              // onClick={()=>handleDeleteUser(friend.id)}
              className="moreDetailss"
            />
          </div>
          {/* {showDelete && <div className="detailsContainer">Delete</div>} */}
        </div>
      ))}
    </div>
  );
};
