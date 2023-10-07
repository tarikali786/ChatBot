import { useChatContext } from "../ContextApi";
import axios from "axios"; // Import axios
import Cookies from "js-cookie"; // Import js-cookie library

export const MoreDetails = () => {
  const { setDetails, setaccess_token } = useChatContext();
  const handleSignOut = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/user/logout/");

      if (response.status === 200) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        localStorage.removeItem("user");

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
      <div className="moreConatiner">
        <span onClick={handleSignOut}>Logout</span>
        {/* Other options or actions */}
      </div>
    </>
  );
};
