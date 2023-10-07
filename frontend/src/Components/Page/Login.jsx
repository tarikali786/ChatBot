import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useChatContext } from "../ContextApi";

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { setaccess_token, loading, setLoading } = useChatContext();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    const storedLoginData = JSON.parse(localStorage.getItem("userLoginDatas"));
    if (storedLoginData && storedLoginData.rememberMe) {
      setInputValue(storedLoginData);
    }
    const access_token = Cookies.get("access_token");
    if (access_token) {
      navigate("/"); // Redirect to the home page if the access token is valid
    }
  }, []);

  const handleInputValue = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setInputValue((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setInputValue((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!inputValue.email || !inputValue.password) {
      setError("Both email and password are required.");
      return;
    }
    try {
      const res = await axios.post("http://127.0.0.1:8000/user/login/", {
        email: inputValue.email.trim(),
        password: inputValue.password,
      });
      // cookies and localStorage

      if (res.data.state === "USER_LOGGED_IN") {
        const access_token = res.data.access_token;
        const headers = {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        };
        console.log("login uuid", res.data.user_id);
        const userID = res.data.user_id;
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/user/userProfile/${userID}/`,
            {
              headers: headers,
            }
          );
          console.log("loginData", response.data.userProfile.name);

          const user = {
            name: response.data.userProfile.name,
            userID: response.data.userProfile.uuid,
            user_profile: response.data.userProfile.profile_image,
            email: response.data.userProfile.email,
          };
          localStorage.setItem("user", JSON.stringify(user));
          // Do something with the response data here
        } catch (error) {
          // Handle any errors that occur during the request
          console.error(error);
        }

        console.log("access", access_token);
        const refresh_token = res.data.refresh_token;

        console.log("refresh_token", refresh_token);

        const accessTokenExpiry = new Date();
        accessTokenExpiry.setDate(accessTokenExpiry.getDate() + 59);

        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 60);

        Cookies.set("access_token", access_token, {
          expires: accessTokenExpiry,
        });

        Cookies.set("refresh_token", refresh_token, {
          expires: refreshTokenExpiry,
        });

        localStorage.setItem("userLoginDatas", JSON.stringify(inputValue));

        setError("");

        setTimeout(() => {
          setaccess_token(access_token);
          setInputValue({
            email: "",
            password: "",
          });

          navigate("/");
          setLoading(false);
        }, 2000);
      } else {
        setError(res.data.state);
        setLoading(false);

      }
    } catch (error) {
      console.error("Response Error:", error.response.data);
      setError(error.response.data.message);
      setLoading(false);

    }
  };

  return (
    <>
      <div className="fromContainer">
        <div className="fromwraper">
          <span className="logo">Chat App</span>
          <span className="title">Login</span>
          <p className="errorMessage">
            {error ? error.split("Firebase:") : null}
          </p>
          <form className="formContainer" onSubmit={handleSubmit}>
            <Box
              sx={{
                "& > :not(style)": {
                  m: 1.2,
                  width: "36ch",
                  display: "flex",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="email"
                value={inputValue.email}
                label="Email"
                variant="standard"
                onChange={handleInputValue}
                name="email"
                type="email"
              />
              <TextField
                id="password"
                name="password"
                value={inputValue.password}
                label="Password"
                variant="standard"
                onChange={handleInputValue}
                type="password"
              />
            </Box>
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={inputValue?.rememberMe}
                  onChange={handleInputValue}
                />{" "}
                Remember me
              </label>
              {/* <a href="#">Forget Password</a> */}
              <Link to="/forget" style={{ color: "#4b63b4" }}>
                Forget Password
              </Link>
            </div>

            <button type="submit" className="buttonContainer">
              {loading ? <span className="loading  " /> : "login"}
            </button>
          </form>
          <p>
            {" You don't have an account ? "}
            <Link to="/register">
              <span>Register</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
