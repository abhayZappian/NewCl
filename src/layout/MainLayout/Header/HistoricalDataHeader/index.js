import React, { useState, useEffect } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const HistoricalDataHeader = () => {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState("/domain-details");
  const handleButtonClick = (path) => {
    setActivePath(path);
    navigate(path);
  };
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);
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
            {" "}
            Domain / IP Historical data
          </Typography>
        </Grid>
        <Grid item xs={6} md={7}>
          <Box display={"flex"} justifyContent={"end"} mt={2} gap={2}>
            {renderButton("/domain-details", "Domain Details")}
            {renderButton("/ip-historical-data", "IP Historical data")}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};
export default HistoricalDataHeader;
