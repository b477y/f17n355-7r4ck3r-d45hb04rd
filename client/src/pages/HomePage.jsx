import {
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useMediaQuery,
} from "@mui/material";
import {
  Home,
  FitnessCenter,
  LocalDining,
  Settings,
  Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";
import { useState, useEffect } from "react";
import BASE_URL from "../constants/baseUrl";
import { useTheme } from "@mui/material/styles";

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [cupsDrank, setCupsDrank] = useState(0);
  const [waterGoal, setWaterGoal] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchWaterData(); // Call the separate function to fetch water data on mount
  }, []);

  const fetchWaterData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/userinfo/water-data`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Water data fetched successfully:", data); // Log fetched data
        setCupsDrank(data.waterDrank || 0); // Update this line
        setWaterGoal(data.waterGoal || 0);
      } else {
        console.error(
          "Failed to fetch water data:",
          response.status,
          response.statusText
        );
        const errorData = await response.json();
        console.error("Error details:", errorData); // Log error details
      }
    } catch (err) {
      console.error("An error occurred while fetching water data:", err);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        logout();
        navigate("/login");
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (err) {
      console.error("An error occurred during logout:", err);
    }
  };

  const incrementCups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/userinfo/increment-cups`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCupsDrank(data.newCupsDrank || cupsDrank + 1); // Increment cupsDrank directly
      } else {
        console.error("Failed to increment cups:", response.statusText);
      }
    } catch (err) {
      console.error("An error occurred while incrementing cups:", err);
    }
  };

  const sidebarItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Activity", icon: <FitnessCenter />, path: "/exercise-form" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
    { text: "Logout", icon: <Lock />, action: handleLogout },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#e8f5e9" }}>
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={!isSmallScreen}
        onClose={() => {}}
        sx={{
          width: isSmallScreen ? "auto" : 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#388e3c",
            color: "#fff",
          },
          [theme.breakpoints.down("sm")]: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "auto",
            padding: "16px",
            backgroundColor: "#388e3c",
            boxShadow: "none",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#bbdefb",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Fitness Tracker
          </Typography>
        </Box>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={item.action || (() => navigate(item.path))}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#66bb6a",
                },
                "& .MuiListItemIcon-root": {
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{ fontSize: "1rem", fontWeight: 500, color: "#e3f2fd" }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            sx={{
              fontWeight: 600,
              color: "#388e3c",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Welcome Back 🎉
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: isSmallScreen ? 2 : 0,
            }}
          >
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
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={2}>
          {[
            {
              title: "Water",
              value: `${cupsDrank} cups / ${waterGoal} cups`,
              progress: waterGoal ? (cupsDrank / waterGoal) * 100 : 0,
              color: "#fff3e0",
              gradient: "linear-gradient(135deg, #ffcc80, #fb8c00)",
            },
            {
              title: "Calories",
              value: "Under",
              progress: null,
              color: "#ffebee",
              gradient: "linear-gradient(135deg, #ef9a9a, #d32f2f)",
            },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  background: card.gradient,
                  color: "#fff",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="h4">{card.value}</Typography>
                {card.progress !== null && (
                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
                  />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          onClick={incrementCups}
          sx={{
            mt: 3,
            backgroundColor: "#388e3c",
            color: "#fff",
            "&:hover": { backgroundColor: "#66bb6a" },
          }}
        >
          Add a Cup of Water
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
