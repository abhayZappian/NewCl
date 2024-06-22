import React, { useState, useEffect } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const GlobalSettingHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  const handleButtonClick = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const renderButton = (path, label) => (
    <Button
      variant={activePath === path ? "contained" : "outlined"}
      onClick={() => handleButtonClick(path)}
    >
      {label}
    </Button>
  );

  return (
    <Card sx={{ height: "70px" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} ml={4}>
          <Box
            sx={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginTop: "5px",
              marginLeft: "30px",
            }}
          />
          {/* <Box sx={{ marginLeft: '30px' }} /> */}
          <Typography
            variant="h2"
            sx={{ mt: "20px", fontFamily: "sans-serif" }}
          >
            Global Journey Settings
          </Typography>
        </Grid>
        <Grid item xs={6} md={7}>
          <Box
            display={"flex"}
            justifyContent={"end"}
            sx={{ whiteSpace: "nowrap" }}
            mt={2}
            gap={2}
          >
            {renderButton("/global-settings/esp", "ESP / ISP Cap")}
            {renderButton("/global-settings/user-level-cap", "User Level Cap")}
            {renderButton(
              "/global-settings/bounce-treatment",
              "Bounce Treatment"
            )}
            {renderButton("/global-settings/esp-commitment", "ESP Commitment")}
            {renderButton(
              "/global-settings/notification-setting",
              "Notification Setting"
            )}
            {renderButton(
              "/global-settings/disaster-and-action",
              "Disaster & Action"
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};
export default GlobalSettingHeader;
