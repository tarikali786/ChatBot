import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import profile_image from "../../assets/user.png";
import { useChatContext } from "../ContextApi";
import "./style.css";
export const Register = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loading, setLoading } = useChatContext();
  const [inputValue, setInputValue] = useState({
    displayName: "",
    email: "",
    password: "",
    profile_image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, displayName, profile_image } = inputValue;
    const randomString = Math.random().toString(36).substring(2, 6);
    const username = `${displayName} ${randomString}`;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", displayName);
      formData.append("username", username);
      formData.append("profile_image", profile_image); // Add profile image to form data

      const response = await axios.post(
        "http://127.0.0.1:8000/user/register/",
        formData, // Use form data here
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle the response as needed

      if (response.data.userID) {
        navigate("/login");
        setLoading(false);
        setError("");
      } else {
        setError("Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleInputValue = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      const file = files[0];
      if (file) {
        setInputValue((prev) => ({
          ...prev,
          [name]: file, // Store the File object itself in state
        }));
      }
    } else {
      setInputValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <div className="fromContainer">
        <div className="fromwraper">
          <span className="logo">Chat App</span>
          <span className="title">Register</span>
          <div>{/* <GoogleSignIn /> */}</div>
          {/* <span className="orLine">Or</span> */}
          <p className="errorMessage">{error}</p>
          <form className="formContainer" onSubmit={handleSubmit}>
            <Box
              component="div"
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
                id="displayName"
                name="displayName"
                label="Display Name"
                variant="standard"
                onChange={handleInputValue}
                value={inputValue.displayName}
                type="text"
                required
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                variant="standard"
                onChange={handleInputValue}
                value={inputValue.email}
                type="email"
                required
              />
              <TextField
                id="password"
                name="password"
                label="Password"
                variant="standard"
                onChange={handleInputValue}
                value={inputValue.password}
                type="password"
                required
              />
            </Box>
            <input
              className="file"
              style={{ display: "none" }}
              id="file"
              type="file"
              name="profile_image"
              onChange={handleInputValue}
            />
            <label className="profile_image" htmlFor="file">
              {inputValue.profile_image ? (
                <img
                  className="registerImageFiled"
                  src={URL.createObjectURL(inputValue.profile_image)} // Display the selected image
                  alt="profile_image"
                />
              ) : (
                <img
                  src={profile_image}
                  className="registerImageFiled"
                  alt="Default profile_image"
                />
              )}
              <span>Add a profile image</span>
            </label>

            <button className="buttonContainer" type="submit">
              {loading ? <span className="loading" /> : "Register"}
            </button>
          </form>
          <p>
            {"Already have an account? "}
            <Link to="/login">
              <span>Login</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
