import {
  Button,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import React from "react";
import { Box, styled } from "@mui/system";
import UploadModal from "./UploadModal";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewFullImage from "./ViewFullImageModal";

import { useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

import { getData } from "services/imageHosting/index";
import { deleteData } from "services/imageHosting/index";

import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import CircularLoader from "ui-component/CircularLoader";
import ConfirmationDialog from "ui-component/conformationModel";

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
const headerCellStyle = {
  borderBottom: "2px solid #7C86BD",
  textAlign: "center",
  position: "relative",
};
const dividerStyle = {
  content: '""',
  position: "absolute",
  top: "10px",
  bottom: "0",
  left: "100%",
  borderLeft: "2px solid #DADADA",
  height: "40px",
};
const CustomTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "#F7F8FC" : "white",
}));
const Index = ({ setOpen, handleCloseUploadModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    open: false,
    id: null,
    url: "",
  });

  const handleDelete = (id, url) => {
    setConfirmationData({ open: true, id: id, url: url });
  };

  const getTableData = async () => {
    try {
      setIsLoading(true);
      const data = await getData();
      console.log(data);
      setData(data?.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    enqueueSnackbar("URL copied to clipboard!", {
      variant: "success",
    });
  };

  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteData(id);
      getTableData();
    } catch (error) {
      console.log(error);
    }
  };
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

  const [viewedImagePath, setViewedImagePath] = useState("");

  const handleViewImage = (url) => {
    setViewedImagePath(url);
  };
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = data?.slice(startIndex, endIndex);

  return (
    <div>
      <Box sx={{ padding: "20px" }}>
        <Box
          sx={{
            backgroundColor: "#FEFEFE",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px #EAEAEE",
            padding: "0.7rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
            mb: 4,
          }}
        >
          <Typography variant="h2" sx={{ fontFamily: "sans-serif" }}>
           Image-Hosting
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <UploadModal getDataRender={getTableData} />
          </Box>
        </Box>
        {isLoading ? (
          <>
            {" "}
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularLoader />
            </Box>
          </>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        borderBottom: "2px solid #7C86BD",
                        textAlign: "left",
                        position: "relative",
                      }}
                    >
                      Title Image
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell align="center" style={{ ...headerCellStyle }}>
                      Url <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell align="center" style={{ ...headerCellStyle }}>
                      Action
                      {/* <span style={dividerStyle}></span> */}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <>
                    {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                      itemsToDisplay?.map((row, index) => (
                        <>
                          {console.log(row?.data)}
                          <CustomTableRow
                            key={row.esp_account_id}
                            index={index}
                          >
                            <TableCell>
                              {row?.url && (
                                <img
                                  style={{ width: "80px", height: "80px" }}
                                  src={row?.url}
                                  alt="Thumbnail"
                                />
                              )}
                            </TableCell>

                            <TableCell align="center">{row?.url}</TableCell>
                            <TableCell align="center">
                              <div>
                                <LightTooltip title="Copy">
                                  <IconButton
                                    sx={{ color: "black" }}
                                    aria-label="copy"
                                    onClick={() => handleCopy(row?.url)}
                                  >
                                    <ContentCopyRoundedIcon />
                                  </IconButton>
                                </LightTooltip>
                                <LightTooltip title="Delete">
                                  <IconButton
                                    sx={{ color: "black" }}
                                    aria-label="share"
                                    onClick={() =>
                                      handleDelete(row?.id, row?.url)
                                    }
                                  >
                                    <DeleteOutlineIcon  />
                                  </IconButton>
                                </LightTooltip>

                                <ViewFullImage imagePath={row.url} />
                              </div>
                            </TableCell>
                          </CustomTableRow>
                        </>
                      ))
                    ) : (
                      <TableRow sx={{ height: "56.5vh" }}>
                        <TableCell
                          sx={{ border: "none" }}
                          colSpan={9}
                          align="center"
                        >
                          {/* No data found */}
                          <span
                            style={{
                              padding: "10px",
                              border: "2px solid #444",
                              backgroundColor: "lightgoldenrodyellow",
                            }}
                          >
                            No data was found
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                </TableBody>
              </Table>
            </TableContainer>
            {confirmationData.open && (
              <ConfirmationDialog
                open={confirmationData.open}
                handleClose={() =>
                  setConfirmationData({ open: false, id: null })
                }
                title={`${confirmationData.url}`}
                content="Are you sure you want to Delete this Image ?"
                onConfirm={() => {
                  handleConfirmDelete(confirmationData.id);
                  setConfirmationData({ open: false, id: null });
                }}
                confirmText="Delete"
              />
            )}
            <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
              <Stack spacing={2} mt={2}>
                <Pagination
                  count={Math.ceil(data?.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                />
              </Stack>
            </Stack>
          </>
        )}
      </Box>
    </div>
  );
};

export default Index;
