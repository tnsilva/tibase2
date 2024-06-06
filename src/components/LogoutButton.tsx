import { logout } from "@/lib/firebaseConfig";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
