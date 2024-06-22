import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { uploadImages } from "services/imageHosting";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip, tooltipClasses, IconButton } from "@mui/material";
import { styled } from "@mui/system";

const Image = ({ getDataRender }) => {
  const [isDisable, setIsDisable] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [uploadedData, setUploadedData] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
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
  const formik = useFormik({
    initialValues: {
      files: [],
    },
    onSubmit: async (values) => {
      // Handle form submission here if needed
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const filteredFiles = files.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const nonImageFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );
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
    event.target.value = null;
  };

  const handlUploadImage = async () => {
    try {
      setIsDisable(true);
      const { data } = await uploadImages(formik.values.files);

      if (data && data.imagePath && data.imagePath.length > 0) {
        const uploadedFiles = formik.values.files.map((file, index) => ({
          file,
          url: data.imagePath[index],
        }));
        setUploadedData(uploadedFiles);
        getDataRender();
      } else {
        enqueueSnackbar("No images uploaded or invalid response", {
          variant: "error",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisable(false);
      formik.resetForm();
    }
  };

  const handleReset = () => {
    setUploadedData([]);
    formik.resetForm();
    setFileInputKey((prevKey) => prevKey + 1);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    enqueueSnackbar("URL copied to clipboard!", {
      variant: "success",
    });
  };

  return (
    <Box>
      <form onSubmit={(event) => event.preventDefault()}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
            key={fileInputKey}
            size="small"
            type="file"
            onClick={handleClick}
            onChange={handleFileChange}
            multiple
            inputProps={{
              accept: ".jpg, .jpeg, .png, .gif",
              multiple: "true",
            }}
            sx={{
              mt: 3,
              width: "72%",
              "& input": {
                padding: "100px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handlUploadImage}
            disabled={formik.values.files.length === 0 || isDisable}
            sx={{ ml: 2, mt: 3 }}
          >
            Upload
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ ml: 2, mt: 3 }}
          >
            Reset
          </Button>
        </Box>
        {uploadedData.length > 0 && (
          <Box sx={{ mt: 1, maxHeight: "200px", overflowY: "auto" }}>
            {uploadedData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ textAlign: "left", ml: 8 }}>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "20px", mb: 1 }}
                  >
                    Image URL:
                  </Typography>
                  <Typography>{item.url}</Typography>
                </Box>
                <LightTooltip title="Copy">
                  <IconButton
                    sx={{ color: "black" }}
                    aria-label="copy"
                    onClick={() => handleCopy(item.url)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </LightTooltip>
                <img
                  src={URL.createObjectURL(item.file)}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginLeft: "10px",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </form>
    </Box>
  );
};

export default Image;
