import { styled } from "@mui/material/styles";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";

import {
  mdiClockOutline,
  mdiContentCopy,
  mdiDeleteOutline,
  mdiPauseCircleOutline,
  mdiPencilCircleOutline,
  mdiStopCircleOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { baseURL } from "config/envConfig";
import { mdiRun } from "@mdi/js";
import { mdiFileEditOutline } from "@mdi/js";
import { mdiDeleteAlertOutline } from "@mdi/js";
import "./Cards.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setBeginNode,
  setCampaignJourneyList,
  setEndNode,
  setJourneyObject,
  setSplitBranchName,
} from "store/action/journeyCanvas";
import { useSnackbar } from "notistack";
import { initialStateJourneyReducer } from "store/reducer/journeyCanvas";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axiosInstance from "helpers/apiService";
import { mdiInformationOutline } from "@mdi/js";
import apiEndPoints from "helpers/APIEndPoints";

import {
  selectCampaignJourneyList,
  selectGetEdges,
  selectGetNodes,
} from "store/selectors";
import { useTheme } from "@mui/material/styles";
import { mdiPlayCircleOutline } from "@mdi/js";
import { FormatDate, FormatTime } from "utils/FormatDateTime";
import SchedularForm from "./SchedularForm";
import ConfirmationDialog from "../../ui-component/conformationModel/index";
import { createdByName, createdBy } from "helpers/userInfo";
import PreviewJourney from "./PreviewJourney";
import { mdiEyeCircleOutline } from "@mdi/js";
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
const shimmerContainers = Array.from({ length: 16 }, (_, index) => (
  <div key={index} id="container">
    <div id="square" className="shimmer"></div>
    <div id="content">
      <div id="content-title" className="shimmer"></div>
      <div id="content-desc">
        <div className="line shimmer"></div>
        <div className="line shimmer"></div>
        <div className="line shimmer"></div>
        <div className="line shimmer"></div>
      </div>
    </div>
  </div>
));
const CustomTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "#F7F8FC" : "white",
}));
const headerCellStyle = {
  borderBottom: "2px solid #7C86BD",
  textAlign: "left",
  position: "relative",
};
const headerCellStyleAction = {
  borderBottom: "2px solid #7C86BD",
  textAlign: "left",
  padding: "15px 35px",
  position: "relative",
};
const dividerStyle = {
  content: '""',
  position: "absolute",
  top: "5px",
  bottom: "0",
  left: "90%",
  borderLeft: "2px solid #DADADA",
  height: "40px",
};

export const CampaignJourneyDashboard = () => {
  const campaignJourneyList = useSelector(selectCampaignJourneyList);
  const [page, setPage] = useState(0);
  const [render, setRender] = useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [journeyId, setjourneyId] = useState("");
  const [journeyIdName, setjourneyIdName] = useState({
    name: "",
    id: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateToReactFlow = () => {
    dispatch(setJourneyObject(initialStateJourneyReducer));
    navigate("/react-email-flow");
  };
  const theme = useTheme();
  const [data, setData] = useState(campaignJourneyList);
  const [Loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isHidden, setIsHidden] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [openRun, setOpenRun] = useState(false);
  const [openPaused, setOpenPaused] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openStop, setOpenStop] = useState(false);
  const [openPausedRun, setOpenPausedRun] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const initNodes = useSelector(selectGetNodes);
  const initEdges = useSelector(selectGetEdges);

  const getListData = async function () {
    axiosInstance
      .get(apiEndPoints.getCampaignJourneyList)
      .then((response) => {
        const responseData = response.data;
        dispatch(setCampaignJourneyList(responseData));
        if (responseData.length) {
          setData(responseData);
          setMyData(responseData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  };

  const ListData = async function () {
    setLoading(true);
    axiosInstance
      .get(apiEndPoints.getCampaignJourneyList)
      .then((response) => {
        const responseData = response.data;

        dispatch(setCampaignJourneyList(responseData));
        if (responseData.length) {
          setData(responseData);
          setMyData(responseData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  };

  const onCopyData = async (journeyId) => {
    try {
      const data = {
        id: journeyId,
        createdByName: createdByName,
        createdBy: createdBy,
      };
      const res = await axiosInstance.post(`${apiEndPoints.getCopyData}`, data);
      console.log(res);
      setLoading(false);
      enqueueSnackbar(`${res?.data?.message}`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`${error?.response?.data?.message}`, {
        variant: "error",
      });
      throw error;
    }
  };

  const onRun = async (journeyId) => {
    try {
      const data = {
        id: journeyId,
      };
      const response = await axiosInstance.post(
        `${apiEndPoints.getRunData}`,
        data
      );
      // enqueueSnackbar(`${response?.data?.message}`, { variant: 'success' });
      enqueueSnackbar(`Run Successfully`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" });
      throw error;
    }
  };

  const onPaused = async (journeyId) => {
    try {
      const response = await axiosInstance.put(
        `${apiEndPoints.getPausedData}/${journeyId}`
      );
      enqueueSnackbar(`${response?.data?.message}`, { variant: "success" });
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
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" });
      throw error;
    }
  };
  useEffect(() => {
    ListData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getListData();
    }, 400);
  }, [render]);

  const OnDelete = async (id) => {
    const url = `${apiEndPoints.getDeleteData}/${id}`;
    try {
      const response = await axiosInstance.delete(url);
      enqueueSnackbar(`${response?.data?.message}`, { variant: "success" });
      getListData();
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const navigateToFlow = (campaignObj) => {
    const splitBranchName = { ...campaignObj?.rowData?.formData };
    for (const key in splitBranchName) {
      if (splitBranchName[key].hasOwnProperty("branches")) {
        const branches = splitBranchName[key].branches;
        dispatch(setSplitBranchName(branches));
      }
    }
    dispatch(setJourneyObject(campaignObj));
    navigate("/email-flow", { state: { isEdit: true } });
  };

  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [myData, setMyData] = useState(data);

  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (searchTerm) => {
    const filteredData = data?.filter((item) =>
      item?.journeyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMyData(filteredData);
    setCurrentPage(1); // Reset the current page to 1 when filtering
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = myData?.slice(startIndex, endIndex);

  const navigation = useNavigate();
  const handleToggle = () => {
    setIsHidden(!isHidden);
  };
  //     const [isHidden, setIsHidden] = useState(false);

  //   const handleToggle = () => {
  //     setIsHidden(!isHidden);
  //   };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDeleteClick = () => {
    setOpenDelete(true);
  };
  const handleDeleteClose = (journeyId) => {
    setOpenDelete(false);
    if (journeyId) {
      OnDelete(journeyId);
    }
  };
  const handleCopyClick = () => {
    setOpenCopy(true);
  };
  const handleCopyClose = (confirmed) => {
    setOpenCopy(false);
    if (confirmed) {
      setRender(!render);
      onCopyData(journeyId);
    }
  };
  const handleRunClick = () => {
    setOpenRun(true);
  };
  const handlePausedRunClick = () => {
    setOpenPausedRun(true);
  };
  const handlePausedRunClose = (journeyId) => {
    setOpenPausedRun(false);
    if (journeyId) {
      onPausedRun(journeyId);
      setRender(!render);
    }
  };
  const handleRunClose = (journeyId) => {
    setOpenRun(false);
    if (journeyId) {
      onRun(journeyId);
      setRender(!render);
    }
  };
  const handlePausedClick = () => {
    setOpenPaused(true);
  };
  const handlePausedClose = (journeyId) => {
    setOpenPaused(false);
    if (journeyId) {
      onPaused(journeyId);
      setRender(!render);
    }
  };
  const handleStopClick = () => {
    setOpenStop(true);
  };
  const handleStopClose = (journeyId) => {
    setOpenStop(false);
    if (journeyId) {
      onStop(journeyId);
      setRender(!render);
    }
  };
  const handleEditClick = () => {
    setOpenEdit(true);
  };
  const handleEditClose = (journeyId) => {
    dispatch(setEndNode(true));
    dispatch(setBeginNode(true));
    setOpenEdit(false);
    if (journeyId) {
      navigateToFlow(journeyId);
    }
  };

  const formik = useFormik({
    initialValues: {
      fromDate: null,
      toDate: null,
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          apiEndPoints.campaignJourney,
          {
            fromDate: values.fromDate
              ? values.fromDate.format("YYYY-MM-DD")
              : "",
            toDate: values.toDate ? values.toDate.format("YYYY-MM-DD") : "",
          }
        );
        if (response.data.status === "success") {
          setData(response.data.data);
          setMyData(response.data.data);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const resetAndFetchData = () => {
    formik.resetForm();
    ListData();
  };

  return (
    <React.Fragment>
      <Box
        className="mainBox"
        sx={{
          bgcolor: "#fff",
          width: "100%",
        }}
      >
        <Box
          sx={{
            padding: "20px 30px",
            width: "100%",
            bgcolor: "#F2F4F8",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontSize: "30px",
              fontWeight: 700,
              lineHeight: "normal",
              letterSpacing: "-0.48px",
              mr: 2, // Adjust margin right for spacing
            }}
          >
            Campaign Journey
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      slotProps={{ textField: { size: "small" } }}
                      label="From Date"
                      value={formik.values.fromDate}
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
                      value={formik.values.toDate}
                      minDate={formik.values.fromDate}
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
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            {" "}
            {/* Adjust margin right for spacing */}
            <FormControlLabel
              control={
                <Switch
                  checked={isHidden}
                  defaultChecked={false} // Set the defaultChecked value accordingly
                  onChange={handleToggle}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              labelPlacement="start" // Adjust the label placement as needed
              label={isHidden ? "LIST" : "GRID"}
            />
          </Box>
          <Box sx={{ width: "250px", mr: 2 }}>
            {" "}
            {/* Adjust margin right for spacing */}
            <TextField
              fullWidth
              type="text"
              placeholder="Search Journey here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => handleSearch(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          <Button
            variant="contained"
            onClick={navigateToReactFlow}
            size="small"
            sx={{
              borderRadius: "10px",
              whiteSpace: "nowrap",
              width: "200px",
              padding: "10px 20px",
              color: "white",
              mr: 2, // Adjust margin right for spacing
            }}
          >
            Create Journey
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/quick-campaign`)}
            sx={{
              borderRadius: "10px",
              whiteSpace: "nowrap",
              width: "200px",
              padding: "10px 20px",
              color: "white",
            }}
          >
            Quick-Campaign
          </Button>
        </Box>
        {isHidden ? (
          <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={0}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0px 40px",
                // border: '1px solid #DADADA',
                alignItems: "center",
                // border: '2px solid red'
              }}
            >
              {Loading ? (
                <Box
                  sx={{
                    height: "650px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress size={60} />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table
                    sx={{
                      "& .MuiTableCell-sizeMedium": {
                        padding: "0px 0px",
                      },
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "20vw" }} />
                      <col style={{ width: "20vw" }} />
                      <col style={{ width: "20vw" }} />
                      <col style={{ width: "20vw" }} />
                      <col style={{ width: "20vw" }} />
                    </colgroup>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ ...headerCellStyle }}>
                          Name
                          <span style={dividerStyle}></span>
                        </TableCell>
                        <TableCell style={{ ...headerCellStyle }}>
                          status
                          <span style={dividerStyle}></span>
                        </TableCell>

                        <TableCell style={{ ...headerCellStyle }}>
                          Created At
                          <span style={dividerStyle}></span>
                        </TableCell>
                        <TableCell style={{ ...headerCellStyle }}>
                          Created By
                          <span style={dividerStyle}></span>
                        </TableCell>

                        <TableCell style={{ ...headerCellStyleAction }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itemsToDisplay?.map((item, index) => (
                        <CustomTableRow key={item.id} index={index}>
                          <TableCell>{item.journeyName}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                width: { xs: "55%", md: "45%", xl: "25%" },
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
                                  item.state === "Draft"
                                    ? "grey"
                                    : item.state === "Running"
                                    ? "green"
                                    : item.state === "Stopped"
                                    ? "red"
                                    : item.state === "Paused"
                                    ? "#e6a100"
                                    : item.state === "Scheduled"
                                    ? "#29adff"
                                    : "",
                              }}
                              variant="h6"
                            >
                              {item.state}
                            </Typography>
                          </TableCell>

                          <TableCell>{item.createdAt}</TableCell>
                          <TableCell>{item.createdByName}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                width: "95%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                pb: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: "50%",
                                  display: "flex",
                                  gap: "10px",
                                }}
                              >
                                <CardActions
                                  disableSpacing
                                  sx={{
                                    padding: "0 0px",
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                  }}
                                >
                                  {item.state === "Draft" && (
                                    <>
                                      <LightTooltip title="Run">
                                        <IconButton
                                          onClick={() => {
                                            handleRunClick();
                                            setjourneyId(item._id);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiPlayCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Edit">
                                        <IconButton
                                          onClick={() => {
                                            handleEditClick();
                                            setjourneyId(item);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            //   navigateToFlow(item);
                                          }}
                                          aria-label="share"
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiPencilCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Schedule">
                                        <IconButton
                                          aria-label="share"
                                          onClick={() => {
                                            handleOpenDialog();
                                            setjourneyId(item._id);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiClockOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Stats">
                                        <IconButton aria-label="share">
                                          <Icon
                                            path={mdiInformationOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="View">
                                        <IconButton
                                          onClick={() => {
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            dispatch(setJourneyObject(item));
                                            setOpenPreview(true);
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiEyeCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                    </>
                                  )}
                                  {item.state === "Scheduled" && (
                                    <>
                                      <LightTooltip title="Run">
                                        <IconButton>
                                          <Icon
                                            path={mdiPlayCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Edit">
                                        <IconButton
                                          onClick={() => {
                                            handleEditClick();
                                            setjourneyId(item);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            //   navigateToFlow(item);
                                          }}
                                          aria-label="share"
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiPencilCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Schedule">
                                        <IconButton
                                          aria-label="share"
                                          onClick={() => {
                                            handleOpenDialog();
                                            setjourneyId(item._id);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiClockOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Stats">
                                        <IconButton aria-label="share">
                                          <Icon
                                            path={mdiInformationOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Stop">
                                        <IconButton
                                          onClick={() => {
                                            onStop(item._id);
                                            setRender(!render);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiStopCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="View">
                                        <IconButton
                                          onClick={() => {
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            dispatch(setJourneyObject(item));
                                            setOpenPreview(true);
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiEyeCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                    </>
                                  )}
                                  {item.state === "Running" && (
                                    <>
                                      <>
                                        <LightTooltip title="Pause">
                                          <IconButton
                                            onClick={() => {
                                              handlePausedClick();
                                              setjourneyId(item._id);
                                              setjourneyIdName({
                                                name: item.journeyName,
                                                id: item._id,
                                              });
                                            }}
                                          >
                                            <Icon
                                              style={{ color: "black" }}
                                              path={mdiPauseCircleOutline}
                                              size={1}
                                            />
                                          </IconButton>
                                        </LightTooltip>
                                      </>
                                      <>
                                        {" "}
                                        <LightTooltip title="Edit">
                                          <IconButton aria-label="share">
                                            <Icon
                                              path={mdiPencilCircleOutline}
                                              size={1}
                                            />
                                          </IconButton>
                                        </LightTooltip>
                                        <LightTooltip title="Schedule">
                                          <IconButton aria-label="share">
                                            <Icon
                                              path={mdiClockOutline}
                                              size={1}
                                            />
                                          </IconButton>
                                        </LightTooltip>
                                        <LightTooltip title="Stats">
                                          <IconButton
                                            aria-label="share"
                                            onClick={() => {
                                              navigation(
                                                `/campaignLeads/${item._id}`
                                              );
                                            }}
                                          >
                                            <Icon
                                              style={{ color: "black" }}
                                              path={mdiInformationOutline}
                                              size={1}
                                            />
                                          </IconButton>
                                        </LightTooltip>
                                        <LightTooltip title="Stop">
                                          <IconButton
                                            onClick={() => {
                                              handleStopClick();
                                              setRender(!render);
                                              setjourneyId(item._id);
                                              setjourneyIdName({
                                                name: item.journeyName,
                                                id: item._id,
                                              });
                                            }}
                                          >
                                            <Icon
                                              style={{ color: "black" }}
                                              path={mdiStopCircleOutline}
                                              size={1}
                                            />
                                          </IconButton>
                                        </LightTooltip>
                                        <LightTooltip title="View">
                                          <IconButton
                                            onClick={() => {
                                              setjourneyIdName({
                                                name: item.journeyName,
                                                id: item._id,
                                              });
                                              dispatch(setJourneyObject(item));
                                              setOpenPreview(true);
                                            }}
                                          >
                                            <Icon
                                              style={{ color: "black" }}
                                              path={mdiEyeCircleOutline}
                                              size={1}
                                            />
                                          </IconButton>
                                        </LightTooltip>
                                      </>
                                    </>
                                  )}
                                  {item.state === "Paused" && (
                                    <>
                                      <LightTooltip title="Run">
                                        <IconButton
                                          onClick={() => {
                                            setjourneyId(item._id);
                                            handlePausedRunClick();
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiPlayCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>

                                      <LightTooltip title="Edit">
                                        <IconButton
                                          onClick={() => {
                                            handleEditClick();
                                            setjourneyId(item);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            //   navigateToFlow(item);
                                          }}
                                          aria-label="share"
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiPencilCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Schedule">
                                        <IconButton aria-label="share">
                                          <Icon
                                            path={mdiClockOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Stats">
                                        <IconButton
                                          aria-label="share"
                                          onClick={() => {
                                            navigation(
                                              `/campaignLeads/${item._id}`
                                            );
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiInformationOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <>
                                        <LightTooltip title="Stop">
                                          <IconButton
                                            onClick={() => {
                                              handleStopClick();
                                              setRender(!render);
                                              setjourneyIdName({
                                                name: item.journeyName,
                                                id: item._id,
                                              });
                                            }}
                                          >
                                            <Icon
                                              style={{ color: "black" }}
                                              path={mdiStopCircleOutline}
                                              size={1}
                                            />
                                          </IconButton>
                                        </LightTooltip>
                                      </>
                                      <LightTooltip title="View">
                                        <IconButton
                                          onClick={() => {
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            dispatch(setJourneyObject(item));
                                            setOpenPreview(true);
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiEyeCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                    </>
                                  )}
                                  {item.state === "Stopped" && (
                                    <>
                                      <LightTooltip title="Edit">
                                        <IconButton aria-label="share">
                                          <Icon
                                            path={mdiPencilCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Schedule">
                                        <IconButton aria-label="share">
                                          <Icon
                                            path={mdiClockOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Stats">
                                        <IconButton
                                          aria-label="share"
                                          onClick={() => {
                                            navigation(
                                              `/campaignLeads/${item._id}`
                                            );
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiInformationOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="View">
                                        <IconButton
                                          onClick={() => {
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            dispatch(setJourneyObject(item));
                                            setOpenPreview(true);
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiEyeCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                    </>
                                  )}
                                </CardActions>
                              </Box>
                              <LightTooltip title="Delete">
                                {item.state === "Running" ? (
                                  <IconButton
                                    sx={{ color: "grey" }}
                                    aria-label="share"
                                    disabled={true}
                                  >
                                    <Icon path={mdiDeleteOutline} size={1.1} />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    sx={{ color: "black" }}
                                    aria-label="share"
                                    onClick={() => {
                                      handleDeleteClick();
                                      setjourneyId(item._id);
                                      setjourneyIdName({
                                        name: item.journeyName,
                                        id: item._id,
                                      });
                                    }}
                                  >
                                    <Icon path={mdiDeleteOutline} size={1.1} />
                                  </IconButton>
                                )}
                              </LightTooltip>
                            </Box>
                          </TableCell>
                        </CustomTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                  marginTop: "50px",
                }}
              >
                <Stack spacing={2} mt={2}>
                  <Stack spacing={2} mt={2}>
                    <Pagination
                      count={Math.ceil(myData.length / itemsPerPage)}
                      page={currentPage}
                      onChange={handleChange}
                      variant="outlined"
                      shape="rounded"
                      color="primary"
                    />
                  </Stack>
                </Stack>
              </Box>
            </Box>
            <Dialog open={openDialog}>
              <Box>
                <SchedularForm
                  getListData={getListData}
                  journeyId={journeyId}
                  handleCloseDialog={handleCloseDialog}
                />
              </Box>
              <DialogActions sx={{ p: 2 }}>
                {/* <Button onClick={handleCloseDialog} variant="outlined" color="primary">
                                    Close
                                </Button> */}
              </DialogActions>
            </Dialog>

            {/* ------------- copy -----  */}
            <ConfirmationDialog
              open={openCopy}
              handleClose={handleCopyClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to copy this Journey?"
              onConfirm={() => handleCopyClose(journeyId)}
              confirmText="Copy"
            />
            {/* ------ run */}
            <ConfirmationDialog
              open={openRun}
              handleClose={handleRunClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Run this Journey?"
              onConfirm={() => handleRunClose(journeyId)}
              confirmText="Run"
            />
            {/* ---------------------- delete ------------- */}
            <ConfirmationDialog
              open={openDelete}
              handleClose={handleDeleteClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Delete this Journey?"
              onConfirm={() => handleDeleteClose(journeyId)}
              confirmText="Delete"
            />
            <ConfirmationDialog
              open={openPaused}
              handleClose={handlePausedClose}
              title={`${journeyIdName.name}`}
              content={`Are you sure you want to Paused this Journey ?`}
              onConfirm={() => handlePausedClose(journeyId)}
              confirmText="Paused"
            />
            <ConfirmationDialog
              open={openEdit}
              handleClose={handleEditClose}
              // title="Edit Confirmation"
              title={`${journeyIdName.name}`}
              content={`Are you sure you want to Edit this journey ?`}
              onConfirm={() => handleEditClose(journeyId)}
              confirmText="Edit"
            />
            <ConfirmationDialog
              open={openStop}
              handleClose={handleStopClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Stop this Journey?"
              onConfirm={() => handleStopClose(journeyId)}
              confirmText="Stop"
            />
            <ConfirmationDialog
              open={openPausedRun}
              handleClose={handlePausedRunClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Run this Journey  ?"
              onConfirm={() => handlePausedRunClose(journeyId)}
              confirmText="Run"
            />
          </Paper>
        ) : (
          <>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "93%",
                  padding: "30px 37px",
                  flexWrap: "wrap",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  ml: 4,
                }}
              >
                {Loading ? (
                  <Box
                    sx={{
                      width: "100vw",
                      flexWrap: "wrap",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {shimmerContainers}
                  </Box>
                ) : (
                  <>
                    {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                      itemsToDisplay?.map((item, index) => (
                        <Box
                          sx={{
                            width: "290px",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: "#ffffff",
                            marginBottom: "15px",
                            marginRight: "15px",
                          }}
                        >
                          <Box sx={{ width: "100%", padding: "4px" }}>
                            <Box
                              sx={{
                                width: "100%",
                                padding: "10px",
                                display: "flex",
                                alignItems: "center",
                                color: "black",
                              }}
                            >
                              <LightTooltip title={`${item.journeyName}`}>
                                <Typography
                                  sx={{
                                    fontWeight: "800",
                                    fontSize: "18px",
                                    flexGrow: 1,
                                    textOverflow: "ellipsis",
                                    overflow: " hidden",
                                    width: "",
                                    cursor: "pointer",
                                  }}
                                >
                                  {item.journeyName}
                                </Typography>
                              </LightTooltip>
                              <LightTooltip title="Copy Journey">
                                <IconButton
                                  onClick={() => {
                                    handleCopyClick();
                                    setjourneyId(item._id);
                                    setjourneyIdName({
                                      name: item.journeyName,
                                      id: item._id,
                                    });
                                  }}
                                >
                                  <Icon
                                    style={{ color: "black" }}
                                    path={mdiContentCopy}
                                    size={1}
                                  />
                                </IconButton>
                              </LightTooltip>
                            </Box>
                            <Box
                              sx={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  width: "40%",
                                  padding: "4px 18px",
                                  borderRadius: "50px",
                                  color: "#fff",
                                  fontWeight: "300",
                                }}
                                style={{
                                  backgroundColor:
                                    item.state === "Draft"
                                      ? "grey"
                                      : item.state === "Running"
                                      ? "green"
                                      : item.state === "Stopped"
                                      ? "red"
                                      : item.state === "Paused"
                                      ? "#e6a100"
                                      : item.state === "Scheduled"
                                      ? "#29adff"
                                      : "",
                                }}
                                variant="h6"
                              >
                                {item.state}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                width: "100%",
                                padding: " 0 10px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  padding: "5px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              ></Box>
                              <Box
                                sx={{
                                  width: "100%",
                                  padding: "5px",
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: "14px", color: "#4c4c4c" }}
                                >
                                  Created time:
                                </Typography>
                                <Box sx={{ display: "flex", gap: "3px" }}>
                                  <Typography
                                    sx={{
                                      fontSize: "14px",
                                      color: "#4c4c4c",
                                    }}
                                  >
                                    &nbsp; {FormatTime(item.createdAt)}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "14px",
                                      color: "#4c4c4c",
                                    }}
                                  >
                                    - {FormatDate(item.createdAt)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  width: "100%",
                                  padding: "5px",
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: "14px", color: "#4c4c4c" }}
                                >
                                  Created By:
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "14px", color: "#4c4c4c" }}
                                >
                                  {item.createdByName}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              width: "95%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              pb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: "50%",
                                display: "flex",
                                gap: "10px",
                              }}
                            >
                              <CardActions
                                disableSpacing
                                sx={{
                                  padding: "0 0px",
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                }}
                              >
                                {item.state === "Draft" && (
                                  <>
                                    <LightTooltip title="Run">
                                      <IconButton
                                        onClick={() => {
                                          handleRunClick();
                                          setjourneyId(item._id);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiPlayCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Edit">
                                      <IconButton
                                        onClick={() => {
                                          handleEditClick();
                                          setjourneyId(item);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                          //   navigateToFlow(item);
                                        }}
                                        aria-label="share"
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiPencilCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Schedule">
                                      <IconButton
                                        aria-label="share"
                                        onClick={() => {
                                          handleOpenDialog();
                                          setjourneyId(item._id);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiClockOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Stats">
                                      <IconButton aria-label="share">
                                        <Icon
                                          path={mdiInformationOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="View">
                                      <IconButton
                                        onClick={() => {
                                          console.log(item);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                          dispatch(setJourneyObject(item));
                                          setOpenPreview(true);
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiEyeCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                )}
                                {item.state === "Scheduled" && (
                                  <>
                                    <LightTooltip title="Run">
                                      <IconButton>
                                        <Icon
                                          path={mdiPlayCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Edit">
                                      <IconButton
                                        onClick={() => {
                                          // debugger
                                          dispatch(setEndNode(true));
                                          dispatch(setBeginNode(true));
                                          navigateToFlow(item);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                        }}
                                        aria-label="share"
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiPencilCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Schedule">
                                      <IconButton
                                        aria-label="share"
                                        onClick={() => {
                                          handleOpenDialog();
                                          setjourneyId(item._id);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiClockOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Stats">
                                      <IconButton aria-label="share">
                                        <Icon
                                          path={mdiInformationOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Stop">
                                      <IconButton
                                        onClick={() => {
                                          onStop(item._id);
                                          setRender(!render);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiStopCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="View">
                                      <IconButton
                                        onClick={() => {
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                          dispatch(setJourneyObject(item));
                                          setOpenPreview(true);
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiEyeCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                )}
                                {item.state === "Running" && (
                                  <>
                                    <>
                                      <LightTooltip title="Pause">
                                        <IconButton
                                          onClick={() => {
                                            handlePausedClick();
                                            setjourneyId(item._id);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiPauseCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                    </>
                                    <>
                                      {" "}
                                      <LightTooltip title="Edit">
                                        <IconButton aria-label="share">
                                          <Icon
                                            path={mdiPencilCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Schedule">
                                        <IconButton aria-label="share">
                                          <Icon
                                            path={mdiClockOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Stats">
                                        <IconButton
                                          aria-label="share"
                                          onClick={() => {
                                            navigation(
                                              `/campaignLeads/${item._id}`
                                            );
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiInformationOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="Stop">
                                        <IconButton
                                          onClick={() => {
                                            handleStopClick();
                                            setRender(!render);
                                            setjourneyId(item._id);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiStopCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="View">
                                        <IconButton
                                          onClick={() => {
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            dispatch(setJourneyObject(item));
                                            setOpenPreview(true);
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiEyeCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                    </>
                                  </>
                                )}
                                {item.state === "Paused" && (
                                  <>
                                    <LightTooltip title="Run">
                                      <IconButton
                                        onClick={() => {
                                          setjourneyId(item._id);
                                          handlePausedRunClick();
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiPlayCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>

                                    <LightTooltip title="Edit">
                                      <IconButton
                                        onClick={() => {
                                          handleEditClick();
                                          setjourneyId(item);
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                        }}
                                        aria-label="share"
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiPencilCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Schedule">
                                      <IconButton aria-label="share">
                                        <Icon path={mdiClockOutline} size={1} />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Stats">
                                      <IconButton
                                        aria-label="share"
                                        onClick={() => {
                                          navigation(
                                            `/campaignLeads/${item._id}`
                                          );
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiInformationOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <>
                                      <LightTooltip title="Stop">
                                        <IconButton
                                          onClick={() => {
                                            handleStopClick();
                                            setRender(!render);
                                            setjourneyId(item._id);
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiStopCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                      <LightTooltip title="View">
                                        <IconButton
                                          onClick={() => {
                                            setjourneyIdName({
                                              name: item.journeyName,
                                              id: item._id,
                                            });
                                            dispatch(setJourneyObject(item));
                                            setOpenPreview(true);
                                          }}
                                        >
                                          <Icon
                                            style={{ color: "black" }}
                                            path={mdiEyeCircleOutline}
                                            size={1}
                                          />
                                        </IconButton>
                                      </LightTooltip>
                                    </>
                                  </>
                                )}
                                {item.state === "Stopped" && (
                                  <>
                                    <LightTooltip title="Edit">
                                      <IconButton aria-label="share">
                                        <Icon
                                          path={mdiPencilCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Schedule">
                                      <IconButton aria-label="share">
                                        <Icon path={mdiClockOutline} size={1} />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="Stats">
                                      <IconButton
                                        aria-label="share"
                                        onClick={() => {
                                          navigation(
                                            `/campaignLeads/${item._id}`
                                          );
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiInformationOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                    <LightTooltip title="View">
                                      <IconButton
                                        onClick={() => {
                                          setjourneyIdName({
                                            name: item.journeyName,
                                            id: item._id,
                                          });
                                          dispatch(setJourneyObject(item));
                                          setOpenPreview(true);
                                        }}
                                      >
                                        <Icon
                                          style={{ color: "black" }}
                                          path={mdiEyeCircleOutline}
                                          size={1}
                                        />
                                      </IconButton>
                                    </LightTooltip>
                                  </>
                                )}
                              </CardActions>
                            </Box>
                            <LightTooltip title="Delete">
                              {item.state === "Running" ? (
                                <IconButton
                                  sx={{ color: "grey" }}
                                  aria-label="share"
                                  disabled={true}
                                >
                                  <Icon path={mdiDeleteOutline} size={1.1} />
                                </IconButton>
                              ) : (
                                <IconButton
                                  sx={{ color: "black" }}
                                  aria-label="share"
                                  onClick={() => {
                                    handleDeleteClick();
                                    setjourneyId(item._id);
                                    setjourneyIdName({
                                      name: item.journeyName,
                                      id: item._id,
                                    });
                                  }}
                                >
                                  <Icon path={mdiDeleteOutline} size={1.1} />
                                </IconButton>
                              )}
                            </LightTooltip>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <TableRow
                        sx={{
                          height: "56.5vh",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TableCell
                          sx={{
                            border: "none",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100vh",
                            width: "90vw",
                          }}
                          colSpan={9}
                        >
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
                )}
              </Box>
            </Box>

            {/*--------- Schedular Form-------  */}
            <Dialog open={openDialog}>
              <Box>
                <SchedularForm
                  getListData={getListData}
                  journeyId={journeyId}
                  handleCloseDialog={handleCloseDialog}
                />
              </Box>
              {/* <DialogActions sx={{ p: 2 }}>
                                 <Button onClick={handleCloseDialog} variant="outlined" color="primary">
                                    Close
                                </Button> 
                            </DialogActions> */}
            </Dialog>

            {/* ------------- copy -----  */}
            <ConfirmationDialog
              open={openCopy}
              handleClose={handleCopyClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to copy this Journey?"
              onConfirm={() => handleCopyClose(journeyId)}
              confirmText="Copy"
            />
            {/* ------ run */}
            <ConfirmationDialog
              open={openRun}
              handleClose={handleRunClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Run this Journey?"
              onConfirm={() => handleRunClose(journeyId)}
              confirmText="Run"
            />
            {/* ---------------------- delete ------------- */}
            <ConfirmationDialog
              open={openDelete}
              handleClose={handleDeleteClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Delete this Journey?"
              onConfirm={() => handleDeleteClose(journeyId)}
              confirmText="Delete"
            />
            <ConfirmationDialog
              open={openPaused}
              handleClose={handlePausedClose}
              title={`${journeyIdName.name}`}
              content={`Are you sure you want to Paused this Journey ?`}
              onConfirm={() => handlePausedClose(journeyId)}
              confirmText="Paused"
            />
            <ConfirmationDialog
              open={openEdit}
              handleClose={handleEditClose}
              // title="Edit Confirmation"
              title={`${journeyIdName.name}`}
              content={`Are you sure you want to Edit this journey ?`}
              onConfirm={() => handleEditClose(journeyId)}
              confirmText="Edit"
            />
            <ConfirmationDialog
              open={openStop}
              handleClose={handleStopClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Stop this Journey?"
              onConfirm={() => handleStopClose(journeyId)}
              confirmText="Stop"
            />
            <ConfirmationDialog
              open={openPausedRun}
              handleClose={handlePausedRunClose}
              title={`${journeyIdName.name}`}
              content="Are you sure you want to Run this Journey  ?"
              onConfirm={() => handlePausedRunClose(journeyId)}
              confirmText="Run"
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                marginTop: "50px",
                padding: "30px",
              }}
            >
              <Stack spacing={2} mt={2}>
                <Stack spacing={2} mt={2}>
                  <Pagination
                    count={Math.ceil(myData.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handleChange}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                  />
                </Stack>
              </Stack>
            </Box>
          </>
        )}
      </Box>
      <PreviewJourney
        openPreview={openPreview}
        initNodes={initNodes}
        initEdges={initEdges}
        setOpenPreview={setOpenPreview}
        journeyDetails={journeyIdName}
      />
    </React.Fragment>
  );
};
