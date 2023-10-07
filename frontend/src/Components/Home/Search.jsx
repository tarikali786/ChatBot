import { useState } from "react";
import UserLogo from "../../assets/template_thumb2.png";
import SearchIcon from "@mui/icons-material/Search";
import "./Home.css";
import { Chats } from "./Chats";
import axios from "axios";
import { useChatContext } from "../ContextApi";

export const Search = () => {
  const [userName, setUserName] = useState("");
  const [findUser, setFindUser] = useState([]);
  const [error, setError] = useState("");
  const { access_token } = useChatContext();

  const handleSearch = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/user/searchUser/", {
        name: userName,
      });

      if (res.status === 200) {
        setError("");
        setFindUser(res.data);
      } else {
        setError("User Not found");
      }
    } catch (error) {
      setError("User Not found");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (userID) => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/chat/ConnectUser/${userID}/`, // Fixed the URL with a trailing slash
        {},
        {
          headers: headers,
        }
      );

      console.log("connected", res.data);
      console.log("user", userID);
      setUserName("");
      setFindUser([]);
    } catch (error) {
      console.error("Error connecting user:", error);
    }
  };

  return (
    <>
      <div className="search">
        <div className="searchFrom">
          <input
            className="searchInput"
            type="text"
            placeholder="Search your Friends"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleKey}
          />
          {userName && (
            <SearchIcon className="searchIcon" onClick={handleSearch} />
          )}
        </div>
        <p
          style={{
            padding: "0 0 0 12px",
          }}
        >
          {error}
        </p>
        {findUser?.users?.map((user) => (
          <div
            className="UserChat"
            key={user?.uuid}
            onClick={() => handleSelect(user.uuid)}
          >
            <img className="userLogoss" src={UserLogo} alt="" />
            <div className="userChatInfo">
              <span>{user?.name}</span>{" "}
              {/* You might want to display the actual user's name */}
            </div>
          </div>
        ))}
      </div>

      <Chats findUser={findUser} />
    </>
  );
};
