import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Input from "@mui/material/Input";
import axios from "axios";
import styled from "styled-components";
import { useFormik } from "formik";
import axiosInstance from "helpers/apiService";
import { useState } from "react";
import { uploadImages } from "services/imageHosting";
import { enqueueSnackbar } from "notistack";
import ImagePreviewTable from "./ImagePreviewTable";
import PreviewModal from "./ImagePreviewTable";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};

const UploadModal = ({ getDataRender }) => {
  const [open, setOpen] = useState(false);
  const [openChild, setOpenChild] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [uplodedData, setUplodedData] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const handlUploadImage = async (values) => {
    try {
      setIsDisable(true);
      const { data } = await uploadImages(formik.values.files);
      if (data) {
        // handleClose()
        setOpenChild(true);
        setUplodedData(data);
        getDataRender();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisable(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      files: [],
    },
    onSubmit: async (values) => {
      handlUploadImage(values);
      // handleClose();
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const filteredFiles = files.filter((file) => allowedTypes.includes(file.type));

    const nonImageFiles = files.filter((file) => !allowedTypes.includes(file.type));
    if (nonImageFiles.length > 0) {
      const errorMessage = "Only JPG, PNG, and GIF images are allowed.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }

    formik.setFieldValue("files", [...formik.values.files, ...filteredFiles]);
  };

  const handleClick = (event) => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 3000) {
      event.preventDefault();
      return;
    }
    setLastClickTime(currentTime);
    event.target.value = null; // Reset the input value to allow re-selection of the same file
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FF831F",
          textTransform: "capitalize",
          height: "100%",
          color: "white",
        }}
        onClick={handleOpen}
      >
        Upload files
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button
            variant="contained"
            sx={{
              position: "absolute",
              right: 30,
              top: 22,
              zIndex: 1301,
              "@media(max-width: 600px)": {
                top: 8,
                right: 8,
              },
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>
          <div>
            <Typography variant="h2" sx={{ fontFamily: "sans-serif" }}>
              Upload Files
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  backgroundColor: "#FEFEFE",
                  borderRadius: "5px",
                  boxShadow: "0px 0px 10px #EAEAEE",
                  padding: "2rem 2.5rem",
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  mb: 4,
                  display: "flex",
                }}
              >
                {/* <input
                  style={{ border: "2px solid red" }}
                  size={"small"}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  multiple
                /> */}
                <div>
      <TextField
        size="small"
        type="file"
        onClick={handleClick}
        onChange={handleFileChange}
        multiple
        inputProps={{
          accept: ".jpg, .jpeg, .png, .gif",
          multiple:"true"
        }}
        sx={{
          "& input": {
            padding: "100px",
          },
        }}
      />
    </div>
              </Box>
              <Typography variant="body3">
                Image format - .jpg, .jpeg, .png, .gif
              </Typography>
              <Typography>Image upload size - Max 2MB</Typography>
              {formik.values.files.length > 0 && (
                <div
                  style={{ maxHeight: "calc(50vh - 100px)", overflowY: "auto" }}
                >
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Title Image</TableCell>
                          <TableCell>Size</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formik.values.files.map((file, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Image ${index + 1}`}
                                style={{
                                  width: "110px",
                                  height: "120px",
                                  marginRight: "10px",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {(file?.size / 1024).toFixed(2)} kb
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                  mt: 2,
                  right: 32,
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.values.files.length === 0 || isDisable}
                >
                  Upload
                </Button>
              </Box>
            </form>
          </div>
          <PreviewModal
            open={openChild}
            setOpen={setOpenChild}
            handleCloseUploadModal={handleClose}
            thumbnailPath={uplodedData?.imagePath}
            imagePath={uplodedData?.imagePath}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default UploadModal;
