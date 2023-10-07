import { useEffect, useState } from "react";
import "./App.css";
import { Home, Login, Register, useChatContext } from "./Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import chatBot from "./assets/chat.png";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
function App() {
  const { access_token } = useChatContext();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="chatbitLoadingPage">
          <div>
            <img src={chatBot} alt="" />
          </div>
          <Box sx={{ width: "20%", borderRadius: "10px", overflow: "hidden" }}>
            <LinearProgress />
          </Box>
        </div>
      </>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={access_token ? <Home /> : <Login />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
