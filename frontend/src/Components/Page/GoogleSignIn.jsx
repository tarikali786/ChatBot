import { GoogleLogin } from "react-google-login";
import "./style.css";

export const GoogleSignIn = () => {
  const onSuccess = (res) => {
    console.log("login sucess", res.profileObj);
  };
  const onFailure = (res) => {
    console.log("failed", res);
  };
  return (
    <div className="googleConatiner">
      <GoogleLogin
        clientId="477904204925-rr8n5mu0mvk2auscmh73jtm1teblo4bl.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    </div>
  );
};
