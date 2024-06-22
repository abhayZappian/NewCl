import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import PowerIcon from "@mui/icons-material/Power";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import {
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import NetworkDrawer from "./drawer";
import ConfirmationDialog from "../../../../ui-component/conformationModel/index";
import { Box, styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import { NetworkAction, networkDetail } from "services/presets/network";
import { useDispatch, useSelector } from "react-redux";
import { selectNetworkTable } from "store/selectors";
import { setNetworkTable } from "store/action/journeyCanvas";
import CircularLoader from "../../../../ui-component/CircularLoader";
import { ESPAction, getAllEspProviderAccount } from "services/adminConsole/esp";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { enqueueSnackbar } from "notistack";

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
const EspTable = () => {
  const [state, setState] = useState({
    isDrawerOpen: false,
    openDelete: false,
    openActive: false,
    openINActive: false,
    isLoading: true,
  });
  const [rowData, setRowData] = useState({});
  const [espName, setEspName] = useState({ name: "", description: "", id: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [espDetails, setEspDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setState({ isLoading: true });
    const { data } = await axiosInstance.get(apiEndPoints.EspCommitment);
    setData(data.result);
    setEspDetails(data.result);
    setState({ isLoading: false });
  };

  const handleAction = async (id, actionType, message) => {
    const data = {
      action: actionType,
    };
    const res = await axiosInstance.put(
      `${apiEndPoints.EspCommitmentStatus}/${id}`,
      data
    );
    enqueueSnackbar(`${res.data.message}`, {
      variant: "success",
    });
    setTimeout(() => {
      getData(currentPage);
    }, 300);
  };
  const action = (id, action) => {
    switch (true) {
      case action === "0":
        if (id) {
          handleAction(espName.id, 0, "Network In-Active Successfully !!!");
        }
        break;
      case action === "1":
        if (id) {
          handleAction(espName.id, 1, "Network Active Successfully !!!");
        }
        break;
      default:
        if (id) {
          handleAction(espName.id, 2, "Network Deleted Successfully !!!");
        }
    }
    setState({ openActive: false, openINActive: false, openDelete: false });
  };
  const openDrawer = () => {
    setRowData({});
    setState({ isDrawerOpen: true });
  };
  const handleEdit = (data) => {
    setRowData(data);
    setState({ isDrawerOpen: true });
  };

  const itemsPerPage = 10;
  const handleSearch = (searchTerm) => {
    const filteredData = espDetails?.filter((item) =>
      item?.data?.esps?.esp_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
    setCurrentPage(1);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = data?.slice(startIndex, endIndex);
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => handleSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{ backgroundColor: "#FF831F", textTransform: "capitalize" }}
            onClick={openDrawer}
          >
            Add
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    ESP Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Account Name <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Volume Committed
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Per Time Period metric
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Created Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Created By
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                  itemsToDisplay?.map((row, index) => (
                    <>
                      <CustomTableRow key={row.esp_account_id} index={index}>
                        <TableCell>{row?.data?.esps?.esp_name}</TableCell>
                        <TableCell>
                          {row?.data?.espAccountName?.account_name}
                        </TableCell>
                        <TableCell>{row.data.espVolume}</TableCell>
                        <TableCell>{row?.data?.periodValues?.label}</TableCell>
                        <TableCell>{row.updatedAt1}</TableCell>
                        <TableCell>{row?.data?.createdByName}</TableCell>
                        <TableCell sx={{ padding: "0px" }}>
                          <LightTooltip title="Edit">
                            <IconButton
                              style={{ color: "#4E99F5" }}
                              aria-label="edit"
                              onClick={() => {
                                handleEdit(row);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </LightTooltip>

                          {row?.data?.actions === "Active" ? (
                            <LightTooltip title="Active">
                              <IconButton
                                onClick={() => {
                                  setEspName({
                                    name: row?.data?.esps.esp_name,
                                    description:
                                      row?.data?.espAccountName?.account_name,
                                    id: row.data._id,
                                  });
                                  setState({ openActive: true });
                                }}
                                style={{ color: "green" }}
                                aria-label="active"
                              >
                                <PowerIcon />
                              </IconButton>
                            </LightTooltip>
                          ) : (
                            <LightTooltip title="In-Active">
                              <IconButton
                                onClick={() => {
                                  setEspName({
                                    name: row?.data?.esps.esp_name,
                                    description:
                                      row?.data?.espAccountName?.account_name,
                                    id: row.data._id,
                                  });
                                  setState({ openINActive: true });
                                }}
                                style={{ color: "red" }}
                                aria-label="active"
                              >
                                <PowerOffIcon />
                              </IconButton>
                            </LightTooltip>
                          )}
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
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
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
      {state.isDrawerOpen && (
        <NetworkDrawer
          getDataRender={getData}
          defaultValues={rowData}
          setDefaultValues={setRowData}
          isDrawerOpen={state.isDrawerOpen}
          setIsDrawerOpen={setState}
        />
      )}

      <ConfirmationDialog
        open={state.openDelete}
        handleClose={action}
        title={`${espName.name}`}
        content="Are you sure you want to Delete this ESP Commitment?"
        onConfirm={() => action(espName.id, "2")}
        confirmText="Delete"
      />
      <ConfirmationDialog
        open={state.openActive}
        handleClose={action}
        title={`${espName.name} (
          ${espName.description})
          `}
        content="Are you sure you want to In-active this ESP Commitment?"
        onConfirm={() => action(espName.id, "0")}
        confirmText="In-Active"
      />
      <ConfirmationDialog
        open={state.openINActive}
        handleClose={action}
        title={`${espName.name} (
        ${espName.description})
        `}
        content="Are you sure you want to Active this ESP Commitment?"
        onConfirm={() => action(espName.id, "1")}
        confirmText="Active"
      />
    </>
  );
};
export default EspTable;
