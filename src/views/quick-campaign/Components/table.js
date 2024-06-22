import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";

import {
  Button,
  Pagination,
  TextField,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import QuickCampaignDrawer from "./drawer";
import ConfirmationDialog from "../../../ui-component/conformationModel/index";
import { Box, Stack, styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import CircularLoader from "../../../ui-component/CircularLoader";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { createdBy, createdByName } from "helpers/userInfo";
import { enqueueSnackbar } from "notistack";
import InfoIcon from "@mui/icons-material/Info";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router";
import PreviewForm from "./PreviewForm";

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
const CustomTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "#F7F8FC" : "white",
}));
const headerCellStyle = {
  borderBottom: "2px solid #7C86BD",
  textAlign: "left",
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

const QuickCampaignTable = () => {
  const navigation = useNavigate();
  const [state, setState] = useState({
    isRunDrawer: false,
    isPausedDrawer: false,
    isStopDrawer: false,
    isCopyDrawer: false,
    isDeleteDrawer: false,
    isDrawerOpen: false,
  });
  const [previewTitle, setPreviewTitle] = useState("preview");
  const [rowData, setRowData] = useState({});
  const [data, setData] = useState([]);
  const [journeyIdName, setjourneyIdName] = useState({
    name: "",
    id: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setState({ isLoading: true });
    const { data } = await axiosInstance.get(apiEndPoints.allQuickJourney);
    // console.log(data.result, "res");
    setData(data.result);
    setMyData(data.result);

    setState({ isLoading: false });
  };
  /// copy quick journey

  const onCopyData = async (journeyId) => {
    try {
      const data = {
        id: journeyId,
        createdByName: createdByName,
        createdBy: createdBy,
      };
      const res = await axiosInstance.post(`${apiEndPoints.getCopyData}`, data);
      // console.log(res);
      // setLoading(false);
      enqueueSnackbar(`${res?.data?.message}`, { variant: "success" });
      getData();
    } catch (error) {
      enqueueSnackbar(`${error?.response?.data?.message}`, {
        variant: "error",
      });
      throw error;
    }
  };

  // const onRun = async (journeyId) => {
  //   try {
  //     const data = {
  //       id: journeyId,
  //     };
  //     const response = await axiosInstance.post(
  //       `${apiEndPoints.getRunData}`,
  //       data
  //     );
  //     // enqueueSnackbar(`${response?.data?.message}`, { variant: 'success' });
  //     enqueueSnackbar(`Run Successfully`, { variant: "success" });
  //     getData();
  //   } catch (error) {
  //     enqueueSnackbar(`${error}`, { variant: "error" });
  //     throw error;
  //   }
  // };

  const onPaused = async (journeyId) => {
    try {
      const response = await axiosInstance.put(
        `${apiEndPoints.getPausedData}/${journeyId}`
      );
      enqueueSnackbar(`${response?.data?.message}`, { variant: "success" });
      getData();
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" });
      throw error;
    }
  };

  const onStop = async (journeyId) => {
    try {
      const response = await axiosInstance.put(
        `${apiEndPoints.getStopData}/${journeyId}`
      );
      enqueueSnackbar(`${response?.data?.message}`, { variant: "success" });
      getData();
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" });
      throw error;
    }
  };
  const onPausedRun = async (journeyId) => {
    try {
      const response = await axiosInstance.put(
        `${apiEndPoints.campaignJourneyStart}/${journeyId}`
      );
      enqueueSnackbar(`${response?.data?.message}`, { variant: "success" });
      getData();
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" });
      throw error;
    }
  };

  const onDelete = async (id) => {
    const url = `${apiEndPoints.getDeleteData}/${id}`;
    try {
      const response = await axiosInstance.delete(url);
      enqueueSnackbar(`${response?.data?.message}`, { variant: "success" });
      getData();
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleCopyOpenDrawer = () => {
    setState({ isCopyDrawer: true });
  };
  const handleRunOpenDrawer = () => {
    setState({ isRunDrawer: true });
  };
  const handlePausedOpenDrawer = () => {
    setState({ isPausedDrawer: true });
  };
  const handleStopOpenDrawer = () => {
    setState({ isStopDrawer: true });
  };
  const handleDeleteOpenDrawer = () => {
    setState({ isDeleteDrawer: true });
  };

  const handleCloseDraweer = () => {
    setState({ isCopyDrawer: false });
    setState({ isRunDrawer: false });
    setState({ isPausedDrawer: false });
    setState({ isStopDrawer: false });
    setState({ isDeleteDrawer: false });
  };

  const copyHandler = (id) => {
    onCopyData(id);
    setState({ isCopyDrawer: false });
  };
  const deleteHandler = (id) => {
    onDelete(id);
    setState({ isDeleteDrawer: false });
  };
  const runHandler = (id) => {
    onPausedRun(id);
    setState({ isRunDrawer: false });
  };
  const pausedHandler = (id) => {
    onPaused(id);
    setState({ isStopDrawer: false });
  };
  const stopHandler = (id) => {
    onStop(id);
    setState({ isPausedDrawer: false });
  };

  const openDrawer = () => {
    setRowData({});
    setState({ isDrawerOpen: true });
  };
  const handleEdit = (data) => {
    setRowData(data);
    setState({ isDrawerOpen: true });
  };

  //// pagination and search filter logics

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [myData, setMyData] = useState([]);

  const itemsPerPage = 10;
  const handleSearch = (searchTerm) => {
    const filteredData = data?.filter((item) =>
      item?.journeyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMyData(filteredData);
    setCurrentPage(1);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = myData?.slice(startIndex, endIndex);

  const formik = useFormik({
    initialValues: {
      fromDate: null,
      toDate: null,
    },
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post(apiEndPoints.quickJourney, {
          fromDate: values.fromDate ? values.fromDate.format("YYYY-MM-DD") : "",
          toDate: values.toDate ? values.toDate.format("YYYY-MM-DD") : "",
        });

        if (response.data.status === "success") {
          setData(response.data.data);
          setMyData(response.data.data);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  });

  const resetAndFetchData = () => {
    formik.resetForm();
    getData();
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FEFEFE",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px #EAEAEE",
          padding: "0.7rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          type="text"
          placeholder="Search "
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => handleSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    slotProps={{ textField: { size: "small" } }}
                    label="From Date"
                    value={formik.values.fromDate}
                    // onChange={(date) => formik.setFieldValue("fromDate", date)}
                    onChange={(date) => {
                      formik.setFieldValue("fromDate", date);
                      formik.setFieldValue("toDate", null);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    slotProps={{ textField: { size: "small" } }}
                    label="To Date"
                    minDate={formik.values.fromDate}
                    value={formik.values.toDate}
                    onChange={(date) => formik.setFieldValue("toDate", date)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button
                variant="contained"
                sx={{ mt: 1, borderRadius: "8px", width: "80px" }}
                type="submit"
                disabled={!formik.values.fromDate || !formik.values.toDate}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                sx={{ mt: 1, borderRadius: "8px", width: "80px" }}
                onClick={resetAndFetchData}
                disabled={!formik.values.fromDate || !formik.values.toDate}
              >
                Reset
              </Button>
            </Box>
          </form>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: "#FF831F", textTransform: "capitalize" }}
            onClick={openDrawer}
          >
            Add Quick Campaign
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 40px",
          border: "1px solid #DADADA",
          alignItems: "center",
        }}
      >
        {state.isLoading ? (
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
        ) : (
          <Box sx={{ width: "100%" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                      style={{ ...headerCellStyle, height: "50px" }}
                    >
                      Campaign ID
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell align="left" style={{ ...headerCellStyle }}>
                      Campaign Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell align="left" style={{ ...headerCellStyle }}>
                      ESP/Server
                      <span style={dividerStyle}></span>
                    </TableCell>
                    {/* <TableCell style={{ ...headerCellStyle }}>
                      List Name
                      <span style={dividerStyle}></span>
                    </TableCell> */}
                    <TableCell style={{ ...headerCellStyle }}>
                      Status
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Created By
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Schedule Date
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                    itemsToDisplay?.map((row, index) => (
                      <CustomTableRow key={row.network_id} index={index}>
                        <TableCell>{row._id}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: "140px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {row.journeyName}
                        </TableCell>
                        <TableCell>
                          {`${row?.rowData?.formData?.dndnode_2_send_email?.espName?.esp_name} ( ${row?.rowData?.formData?.dndnode_2_send_email?.emailServiceAccount?.account_name})`}
                        </TableCell>
                        {/* <TableCell>
                          {
                            row.rowData.formData
                              .dndnode_1_contact_enters_journey.contacts[0].list
                              .list_name
                          }
                        </TableCell> */}
                        <TableCell>
                          <Typography
                            sx={{
                              // width: { xs: "55%", md: "45%", xl: "25%" },
                              padding: {
                                xs: "4px",
                                md: "4px 15px",
                                xl: "4px 20px",
                              },
                              borderRadius: "50px",
                              color: "#fff",
                              fontWeight: "300",
                            }}
                            style={{
                              backgroundColor:
                                row.state === "Draft"
                                  ? "grey"
                                  : row.state === "Running"
                                  ? "green"
                                  : row.state === "Stopped"
                                  ? "red"
                                  : row.state === "Paused"
                                  ? "#e6a100"
                                  : row.state === "Scheduled"
                                  ? "#29adff"
                                  : "",
                            }}
                            variant="h6"
                          >
                            {row.state}
                          </Typography>
                        </TableCell>
                        <TableCell>{row?.createdByName}</TableCell>
                        <TableCell>{row?.scheduleAt}</TableCell>
                        <TableCell sx={{ padding: "0px" }}>
                          {/* //// draft */}
                          {row.state === "Draft" && (
                            <>
                              <LightTooltip title="Edit">
                                <IconButton
                                  style={{ color: "#4E99F5" }}
                                  aria-label="edit"
                                >
                                  <EditIcon onClick={() => handleEdit(row)} />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Copy">
                                <IconButton
                                  sx={{ color: "" }}
                                  aria-label="share"
                                  onClick={() => {
                                    handleCopyOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </LightTooltip>

                              <LightTooltip title="Delete">
                                <IconButton
                                  sx={{ color: "" }}
                                  aria-label="share"
                                  // onClick={() => onDelete(row._id)}
                                  onClick={() => {
                                    handleDeleteOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </LightTooltip>
                            </>
                          )}
                          {/* /// schedule rendaring */}
                          {row.state === "Scheduled" && (
                            <>
                              <LightTooltip title="Edit">
                                <IconButton
                                  style={{ color: "#4E99F5" }}
                                  aria-label="edit"
                                >
                                  <EditIcon onClick={() => handleEdit(row)} />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Stop">
                                <IconButton
                                  onClick={() => {
                                    handleStopOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                  sx={{ color: "" }}
                                >
                                  <StopCircleIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Copy">
                                <IconButton
                                  sx={{ color: "" }}
                                  aria-label="share"
                                  onClick={() => {
                                    handleCopyOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </LightTooltip>

                              <LightTooltip title="Delete">
                                <IconButton
                                  sx={{ color: "" }}
                                  aria-label="share"
                                  // onClick={() => onDelete(row._id)}
                                  onClick={() => {
                                    handleDeleteOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </LightTooltip>
                            </>
                          )}
                          {/* // Running */}
                          {row.state === "Running" && (
                            <>
                              <LightTooltip title="Paused">
                                <IconButton
                                  onClick={() => {
                                    handlePausedOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                  sx={{ color: " " }}
                                >
                                  <PauseCircleOutlineIcon />
                                </IconButton>
                              </LightTooltip>

                              <LightTooltip title="Stop">
                                <IconButton
                                  onClick={() => {
                                    handleStopOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                  sx={{ color: "" }}
                                >
                                  <StopCircleIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Stats">
                                <IconButton
                                  sx={{ color: "" }}
                                  aria-label="share"
                                  onClick={() => {
                                    navigation(`/campaignLeads/${row._id}`);
                                  }}
                                >
                                  <InfoIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Copy">
                                <IconButton
                                  sx={{ color: "" }}
                                  onClick={() => {
                                    handleCopyOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </LightTooltip>
                            </>
                          )}
                          {/* /// paused */}
                          {row.state === "Paused" && (
                            <>
                              {/* <LightTooltip title="Edit">
                                <IconButton
                                  style={{ color: "#4E99F5" }}
                                  aria-label="edit"
                                >
                                  <EditIcon onClick={() => handleEdit(row)} />
                                </IconButton>
                              </LightTooltip> */}
                              <LightTooltip title="Run">
                                <IconButton
                                  onClick={() => {
                                    handleRunOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                  sx={{ color: "" }}
                                >
                                  <PlayCircleOutlineIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Stop">
                                <IconButton
                                  onClick={() => {
                                    handleStopOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                  sx={{ color: "" }}
                                >
                                  <StopCircleIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Stats">
                                <IconButton
                                  onClick={() => {
                                    navigation(`/campaignLeads/${row._id}`);
                                  }}
                                  sx={{ color: "" }}
                                >
                                  <InfoIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Copy">
                                <IconButton
                                  onClick={() => {
                                    handleCopyOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                  sx={{ color: "" }}
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </LightTooltip>
                            </>
                          )}
                          {/* // stop  */}
                          {row.state === "Stopped" && (
                            <>
                              {/* <LightTooltip title="Edit">
                              <IconButton
                                style={{ color: "#4E99F5" }}
                                aria-label="edit"
                              >
                                <EditIcon onClick={() => handleEdit(row)} />
                              </IconButton>
                            </LightTooltip> */}
                              <LightTooltip title="Stats">
                                <IconButton
                                  sx={{ color: "" }}
                                  aria-label="share"
                                  onClick={() => {
                                    navigation(`/campaignLeads/${row._id}`);
                                  }}
                                >
                                  <InfoIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Copy">
                                <IconButton
                                  onClick={() => {
                                    handleCopyOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </LightTooltip>
                              <LightTooltip title="Delete">
                                <IconButton
                                  sx={{ color: "" }}
                                  aria-label="share"
                                  // onClick={() => onDelete(row._id)}
                                  onClick={() => {
                                    handleDeleteOpenDrawer();
                                    setjourneyIdName({
                                      name: row.journeyName,
                                      id: row._id,
                                    });
                                  }}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </LightTooltip>
                            </>
                          )}
                          <LightTooltip title={previewTitle}>
                            <IconButton sx={{ color: "" }}>
                              {/* <VisibilityIcon /> */}
                              <PreviewForm
                                values={row.storeData}
                                isTable={true}
                                setPreviewTitle={setPreviewTitle}
                              />
                            </IconButton>
                          </LightTooltip>
                        </TableCell>
                      </CustomTableRow>
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
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      {state.isDrawerOpen && (
        <QuickCampaignDrawer
          getDataRender={getData}
          defaultValues={rowData}
          setDefaultValues={setRowData}
          isDrawerOpen={state.isDrawerOpen}
          setIsDrawerOpen={setState}
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
      <ConfirmationDialog
        open={state.isRunDrawer}
        handleClose={handleCloseDraweer}
        title={`${journeyIdName.name}`}
        content={`Are you sure you want to Run this Journey ?`}
        onConfirm={() => runHandler(journeyIdName.id)}
        confirmText="Start"
      />
      <ConfirmationDialog
        open={state.isPausedDrawer}
        handleClose={handleCloseDraweer}
        title={`${journeyIdName.name}`}
        content={`Are you sure you want to Paused this Journey ?`}
        onConfirm={() => pausedHandler(journeyIdName.id)}
        confirmText="Paused"
      />
      <ConfirmationDialog
        open={state.isStopDrawer}
        handleClose={handleCloseDraweer}
        title={`${journeyIdName.name}`}
        content={`Are you sure you want to Stop this Journey ?`}
        onConfirm={() => stopHandler(journeyIdName.id)}
        confirmText="stop"
      />
      <ConfirmationDialog
        open={state.isCopyDrawer}
        handleClose={handleCloseDraweer}
        title={`${journeyIdName.name}`}
        content={`Are you sure you want to Copy this Journey ?`}
        onConfirm={() => copyHandler(journeyIdName.id)}
        confirmText="Copy"
      />
      <ConfirmationDialog
        open={state.isDeleteDrawer}
        handleClose={handleCloseDraweer}
        title={`${journeyIdName.name}`}
        content={`Are you sure you want to Delete this Journey ?`}
        onConfirm={() => deleteHandler(journeyIdName.id)}
        confirmText="Delete"
      />
    </>
  );
};
export default QuickCampaignTable;
