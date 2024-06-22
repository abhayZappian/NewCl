import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Tooltip, tooltipClasses, IconButton } from "@mui/material";
import { styled } from "@mui/system";

const { Button, Box, Modal } = require("@mui/material");
const { useState } = require("react");

const ViewFullImage = ({ imagePath }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    height: "60%",
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "5px",
    // overflow: "auto",
  };
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));
  return (
    <>
      <LightTooltip title="View">
        <IconButton
          sx={{ color: "black" }}
          aria-label="view"
          onClick={handleOpen}
        >
          <RemoveRedEyeIcon size={2} />
        </IconButton>
      </LightTooltip>

      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <div style={style}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              position: "fixed",
              top: 5,
              right: 5,
              backgroundColor: "#FF831F",
            }}
          >
            <CloseIcon />
          </Button>{" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          >
            <img style={{ height: "100%", maxWidth:"80%" }} src={imagePath} alt="image" />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ViewFullImage;
