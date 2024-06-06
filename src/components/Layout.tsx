// components/Layout.tsx
import React, { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Knowledge Base
          </Typography>
          {user ? (
            <>
              <Typography variant="body1" component="div">
                {user.displayName}
              </Typography>
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
