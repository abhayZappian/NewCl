import React, { useState } from "react";
import Box from "@mui/material/Box";
import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import Flush from "./components/flushTable";
import Engagement from "./components/engagementTable";
import PageHeader from "layout/MainLayout/Header/PageHeader";

const Segment = () => {
  const [selectedValue, setSelectedValue] = useState("engagement");

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <PageHeader />
      <Box
        sx={{
          height: "95vh",
          width: "100%",
          backgroundColor: "#fff",
          mt: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FEFEFE",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px #EAEAEE",
            padding: "2rem 1rem",
            display: "flex",
            gap: "10px",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "1rem" }}>Select Segment Type</Typography>
          <RadioGroup row value={selectedValue} onChange={handleRadioChange}>
            <Box
              sx={{
                height: "2.2rem",
                border: "1px solid #d1d4d7",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <FormControlLabel
                sx={{
                  margin: "0",
                  pl: 1,
                  backgroundColor:
                    selectedValue === "engagement" ? "#ffdfc5" : "none",
                }}
                value="engagement"
                control={<Radio color="default" size="small" />}
                label="Email Engagement"
                labelPlacement="start"
              />
            </Box>
            <Box
              sx={{
                height: "2.2rem",
                border: "1px solid #d1d4d7",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                ml: 2,
              }}
            >
              <FormControlLabel
                sx={{
                  margin: "0",
                  pl: 1,
                  backgroundColor:
                    selectedValue === "flush" ? "#ffdfc5" : "none",
                }}
                value="flush"
                control={<Radio color="default" size="small" />}
                label="Email Flush"
                labelPlacement="start"
              />
            </Box>
          </RadioGroup>
        </Box>

        <Box>{selectedValue === "flush" ? <Flush /> :
          <Engagement />
        }</Box>
      </Box>
    </>
  );
};

export default Segment;
