import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useEffect } from "react";
import {
  Button,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import NetworkListDrawer from "./drawer";
import { Box, Stack, styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import CircularLoader from "ui-component/CircularLoader";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";

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
export default function NetworkListtable() {
  const [open, setOpen] = useState({
    drawer: false,
    isLoading: true,
  });
  const [rowData, setRowData] = useState({});
  const [data, setData] = useState([]);
  const [networkDetails, setNetworkDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setOpen({ isLoading: true });
    const { data } = await axiosInstance.get(apiEndPoints.getNetworkDetails);
    setData(data?.data);
    setNetworkDetails(data?.data);
    setOpen({ isLoading: false });
  };

  const itemsPerPage = 10;
  const handleSearch = (searchTerm) => {
    const filteredData = networkDetails?.filter((item) =>
      item?.networkName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = data?.slice(startIndex, endIndex);

  const openDrawer = () => {
    setRowData({});
    setOpen({ drawer: true });
  };
  const handleEdit = (data) => {
    setRowData(data);
    setOpen({ drawer: true });
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
          backgroundColor: "white",
          mt: 2,
        }}
      >
        {open.isLoading ? (
          <Box
            sx={{
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, height: "50px" }}
                  >
                    Network ID
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Network Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Description
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Created By
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Created Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsToDisplay && itemsToDisplay.length > 0 ? (
                  itemsToDisplay?.map((row, index) => (
                    <CustomTableRow key={row.id} index={index}>
                      <TableCell>{row.networkId}</TableCell>
                      <TableCell>{row.networkName}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.createdByName}</TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell sx={{ padding: "0px" }}>
                        <LightTooltip title="Edit">
                          <IconButton
                            style={{ color: "#4E99F5" }}
                            aria-label="edit"
                          >
                            <EditIcon
                              onClick={() => {
                                handleEdit(row);
                              }}
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
        )}
      </Box>
      <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
        <Stack spacing={2} mt={2}>
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Stack>
      <NetworkListDrawer
        defaultValues={rowData}
        getDataRender={getData}
        open={open.drawer}
        setOpen={setOpen}
      />
    </>
  );
}
