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
  useMediaQuery 
} from "@mui/material";
import { Home, FitnessCenter, LocalDining, Settings, Lock } from '@mui/icons-material'; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext"; 
import { useState } from "react";
import BASE_URL from "../constants/baseUrl";
import { useTheme } from '@mui/material/styles'; 

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null); 
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); 

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
        credentials: "include", 
      });

      if (response.ok) {
        logout(); 
        navigate("/login"); 
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
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f0f4f8" }}>
      {/* Sidebar */}
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={!isSmallScreen}
        onClose={() => {}}
        sx={{
          width: isSmallScreen ? 'auto' : 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#1a237e", // Dark blue sidebar background
            color: "#fff", // White text color
          },
          [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'auto',
            padding: '16px',
            backgroundColor: '#1a237e',
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#bbdefb" }}>
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
                "&:hover": {
                  backgroundColor: "#3949ab", // Lighter blue on hover
                },
                "& .MuiListItemIcon-root": {
                  color: "#fff", // White icon color
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={<Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "#e3f2fd" }}>{item.text}</Typography>} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 600, color: "#1a237e" }}>
            Welcome Back 🎉
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mt: isSmallScreen ? 2 : 0 }}>
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
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={2}>
          {[
            { title: "Steps", value: "2,500", progress: "50%", color: "#e1f5fe", gradient: "linear-gradient(135deg, #81d4fa, #0288d1)" },
            { title: "Water", value: "1.25 L", progress: "Dashboard", color: "#fff3e0", gradient: "linear-gradient(135deg, #ffcc80, #fb8c00)" },
            { title: "Calories", value: "Under", progress: "", color: "#ffebee", gradient: "linear-gradient(135deg, #ef9a9a, #d32f2f)" },
            { title: "Heart Rate", value: "110 bpm", progress: "", color: "#f3e5f5", gradient: "linear-gradient(135deg, #ba68c8, #7b1fa2)" }
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={3} sx={{ 
                p: 2, 
                background: card.gradient,
                color: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  transition: "transform 0.2s ease-in-out"
                }
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{card.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{card.value}</Typography>
                <Typography variant="body2" sx={{ color: "#e0f7fa" }}>{card.progress}</Typography>
              </Paper>
            </Grid>
          ))}

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: "8px", backgroundColor: "#fafafa", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a237e" }}>Activity</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: "#666" }}>50% complete</Typography>
                <Box sx={{ ml: 2, width: "100%" }}>
                  <LinearProgress variant="determinate" value={50} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: "8px", backgroundColor: "#fafafa", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a237e" }}>Progress</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#0288d1" }}>40 hrs</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>Stretching</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
