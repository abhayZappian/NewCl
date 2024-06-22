import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";

const CreativeDrawer = ({ open, setOpen, red1, formType }) => {
  const handleClose = () => {
    // setOpen(false);
    setOpen({ formType: true });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "70%",
    borderRadius: "6px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ mt: 1 }}
            id="modal-modal-title"
            variant="h2"
            component="h2"
          >
            Note: Approved from network side, but if you see any miscellaneous
            and confusing word before use please X contact your POC's.
          </Typography>
          <Button
            sx={{ backgroundColor: "#FF831F", mb: 2 }}
            variant="contained"
            onClick={handleClose}
          >
            <ClearSharpIcon />
          </Button>
        </Box>

        <Box mt={3} sx={{ ml: 2 }}>
          {red1.length > 0 && (
            <>
              <Typography variant="h3">{formType}</Typography>
              <Box mt={2}>
                {red1.map((name, index) => (
                  <Typography key={index}>{name}</Typography>
                ))}
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            sx={{ backgroundColor: "#FF831F", mt: 2 }}
            variant="contained"
            onClick={handleClose}
          >
            Hide Description
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreativeDrawer;
