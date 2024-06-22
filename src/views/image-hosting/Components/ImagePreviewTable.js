import { enqueueSnackbar } from "notistack";
import ViewFullImage from "./ViewFullImageModal";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, tooltipClasses, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const {
  Modal,
  Button,
  TableCell,
  Typography,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Box,
} = require("@mui/material");
const { useState } = require("react");

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
  overflow: "auto",
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
const PreviewModal = ({
  thumbnailPath,
  imagePath,
  open,
  setOpen,
  handleCloseUploadModal,
}) => {
  // const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleCloseUploadModal();
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleThumbnailClick = (imagePath) => {
    setSelectedImage(imagePath);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage("");
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    enqueueSnackbar("URL copied to clipboard!", {
      variant: "success",
    });
  };
  return (
    <>
      {/* <Button onClick={handleOpen}>Open Child Modal</Button> */}
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
          </Button>

          <TableContainer sx={{ marginTop: "35px", height: "90%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell align="center">URL</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {thumbnailPath?.map((thumbnail, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: "80px", height: "90px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleThumbnailClick(imagePath[index])}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography align="center" variant="body2">
                        {imagePath[index]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <LightTooltip title="Copy">
                        <IconButton
                          sx={{ color: "black" }}
                          aria-label="copy"
                          onClick={() => handleCopy(imagePath[index])}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </LightTooltip>
                      {/* <Button href={imagePath[index]} target="_blank">
                        View
                      </Button> */}
                      <ViewFullImage imagePath={imagePath[index]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ top: "5%", left: "94.1%" }}
            >
              <DoneAllIcon /> Ok
            </Button> */}
          </TableContainer>
        </div>
      </Modal>
    </>
  );
};

export default PreviewModal;
