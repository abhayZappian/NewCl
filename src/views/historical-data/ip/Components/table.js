import React, { useEffect, useState } from "react";
import {
  Box,
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
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { tooltipClasses, Tooltip } from "@mui/material";
import Drawer from "./drawer";
import EditDrawer from "./editdrawer";
import AddIcon from "@mui/icons-material/Add";
import { getData } from "services/IP";
import CircularLoader from "ui-component/CircularLoader";
import DateFormatter from "utils/FormatDateTime";
import EditIcon from "@mui/icons-material/Edit";

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

const IpTable = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [ipDetails, setIpDetails] = useState([]);
  const [rowData, setRowData] = useState({});

  const openDrawer = () => {
    setOpen(true);
  };

  const handleSearch = (searchTerm) => {
    const filteredData = data?.filter((item) =>
      item?.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setIpDetails(filteredData);
    setCurrentPage(1);
  };
  const getTableData = async () => {
    try {
      setIsLoading(true);
      const response = await getData();
      setData(response?.data);
      console.log(response?.data, "date");
      setIpDetails(response?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  const handleEdit = (data) => {
    setRowData(data);
    setOpenEdit(true);
  };

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToDisplay = ipDetails?.slice(startIndex, endIndex);

  return (
    <div>
      {isLoading ? (
        <>
          {" "}
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "white",
            }}
          >
            <CircularLoader />
          </Box>
        </>
      ) : (
        <>
          {" "}
          <Box>
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
                variant="outlined"
                size="small"
                // onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => handleSearch(e.target.value)}
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
                  sx={{
                    backgroundColor: "#FF831F",
                    textTransform: "capitalize",
                  }}
                  onClick={openDrawer}
                >
                  Add
                </Button>
              </Box>
            </Box>
            {/* <Button onClick={() => openDrawer()}>click me</Button> */}
          </Box>
          <Box sx={{ mt: 2, p: 3 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                      style={{ ...headerCellStyle, height: "50px" }}
                    >
                      S.No
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell align="left" style={{ ...headerCellStyle }}>
                      IP (Range Format)
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Organization Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Portal Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      User Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Expiry Date
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Purchased Date
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Actions
                      {/* <span style={dividerStyle}></span> */}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                    itemsToDisplay?.map((e, i) => (
                      <CustomTableRow index={i} key={i}>
                        <>
                          <TableCell>{e?.serialNo}</TableCell>
                          <TableCell>{e?.ip_add}</TableCell>
                          <TableCell>{e?.organization_name}</TableCell>
                          <TableCell>{e?.portal_name}</TableCell>
                          <TableCell>{e?.user_name}</TableCell>
                          <TableCell>{DateFormatter(e?.expiry_date)}</TableCell>
                          <TableCell>
                            {DateFormatter(e?.purchased_date)}
                          </TableCell>

                          <TableCell sx={{ padding: "0px" }}>
                            <LightTooltip title="Edit">
                              <IconButton
                                style={{ color: "#4E99F5" }}
                                aria-label="edit"
                              >
                                <EditIcon onClick={() => handleEdit(e)} />
                              </IconButton>
                            </LightTooltip>
                          </TableCell>
                        </>
                      </CustomTableRow>
                    ))
                  ) : (
                    <TableRow sx={{ height: "56.5vh" }}>
                      <TableCell
                        sx={{ border: "none" }}
                        colSpan={9}
                        align="center"
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
                </TableBody>{" "}
              </Table>
            </TableContainer>
            <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
              <Stack spacing={2} mt={2}>
                <Pagination
                  count={Math.ceil(ipDetails?.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                />
              </Stack>
            </Stack>
          </Box>
          <Drawer
            defaultValues={rowData}
            setDefaultValues={setRowData}
            open={open}
            setOpen={setOpen}
            getRenderData={getTableData}
          />
          <EditDrawer
            defaultValues={rowData}
            setDefaultValues={setRowData}
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            getRenderData={getTableData}
          />
        </>
      )}
    </div>
  );
};

export default IpTable;
