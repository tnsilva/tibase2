// components/LoginButton.tsx
import React from "react";
import { Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLogin}>
      Sign in with Google
    </Button>
  );
};

export default LoginButton;
