import { Chat, Sidebar } from "../Home";
import "./style.css";
export const Home = () => {
  // const { access_token } = useChatContext();

  return (
    <>
      <div className="home">
        <div className="container">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </>
  );
};
