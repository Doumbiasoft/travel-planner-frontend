import { useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import { useAlertNotification } from "./AlertNotification";
import { useNavigate } from "react-router-dom";
import unitOfWork from "../api/unit-of-work";

interface GoogleUserInfo {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export const useGoogleOauth = () => {
  const [googleToken, setGoogleToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const openNotification = useAlertNotification();
  const navigate = useNavigate();

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleToken(tokenResponse.access_token);
    },
    onError: () => {
      openNotification("Google sign-in failed", "error");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const handleGoogleAuth = async () => {
      if (!googleToken) return;

      setIsLoading(true);

      try {
        const { data: googleUser } = await axios.get<GoogleUserInfo>(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken}`,
          {
            headers: {
              Authorization: `Bearer ${googleToken}`,
              Accept: "application/json",
            },
          }
        );
        console.log(googleUser);

        const response = await unitOfWork.auth.signInWithGoogle({
          email: googleUser.email,
          firstName: googleUser.given_name
            ? googleUser.given_name
            : googleUser.name,
          lastName: googleUser.family_name ? googleUser.family_name : "",
          oauthPicture: googleUser.picture,
          oauthProvider: "Google",
          oauthUid: googleUser.id,
        });

        if (response.success === true) {
          await login(response.data.accessToken);
          openNotification("Signed in successfully with Google", "success");
          navigate("/dashboard");
        } else {
          openNotification("Google sign-in failed", "error");
        }
      } catch (error: any) {
        console.error("Google auth error:", error);
        openNotification(
          error?.response?.data?.message || "Google sign-in failed",
          "error"
        );
      } finally {
        setIsLoading(false);
        setGoogleToken("");
      }
    };

    handleGoogleAuth();
  }, [googleToken, login, openNotification, navigate]);

  return {
    handleGoogleSignIn,
    isLoading,
    googleLogout,
  };
};
