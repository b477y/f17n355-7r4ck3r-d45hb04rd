import { Button, Typography, Box, Container, Grid, Paper, Avatar, LinearProgress, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Home, FitnessCenter, LocalDining, Settings, Lock } from '@mui/icons-material'; // Icons for the sidebar
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext"; // Import Auth Context
import { useState } from "react";
import BASE_URL from "../constants/baseUrl";

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Access the logout function
  const [anchorEl, setAnchorEl] = useState(null); // For user profile menu
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // Important to include cookies in the request
      });

      if (response.ok) {
        logout(); // Clear the auth state on the frontend
        navigate("/login"); // Redirect to the login page
      } else {
        console.error("Failed to log out.");
      }
    } catch (err) {
      console.error("An error occurred during logout:", err);
    }
  };

  const sidebarItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Activity", icon: <FitnessCenter />, path: "/activity" },
    { text: "Diet", icon: <LocalDining />, path: "/diet" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
    { text: "Logout", icon: <Lock />, action: handleLogout },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#f7f7f7", // Sidebar background
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Fitness Tracker</Typography>
        </Box>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem button key={index} onClick={item.action || (() => navigate(item.path))}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Welcome Back 🎉</Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar alt="User Name" src="https://via.placeholder.com/150" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={3}>
          {/* First row */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#edf6ff" }}> {/* Light Blue */}
              <Typography variant="h6">Steps</Typography>
              <Typography variant="h4" color="primary">2,500</Typography>
              <Typography>50% of your goal</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#fff5eb" }}> {/* Light Orange */}
              <Typography variant="h6">Water</Typography>
              <Typography variant="h4" color="primary">1.25 L</Typography>
              <Typography>Today's intake</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#ffebf0" }}> {/* Light Red */}
              <Typography variant="h6">Calories</Typography>
              <Typography variant="h4" color="primary">Under</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: "#f3ebff" }}> {/* Light Purple */}
              <Typography variant="h6">Heart Rate</Typography>
              <Typography variant="h4" color="primary">110 bpm</Typography>
            </Paper>
          </Grid>

          {/* Second row */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">Activity</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2">50% complete</Typography>
                <Box sx={{ ml: 2, width: "100%" }}>
                  <LinearProgress variant="determinate" value={50} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">Progress</Typography>
              <Typography variant="h4">40 hrs</Typography>
              <Typography variant="body2">Stretching</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
