import React, { useState, useEffect, Suspense } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
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
import ConfirmationDialog from "../../../../ui-component/conformationModel/index";
import { Box, styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CreateSegment from "./drawer";
import {
  engagementCopy,
  engagementCountRefresh,
  engagementDelete,
  getEngagementData,
} from "services/dataManagement/segment";
import { useDispatch, useSelector } from "react-redux";
import { selectEmailEngagementTable } from "store/selectors";
import { setEmailEngagementTable } from "store/action/dataManagement";
import CircularLoader from "ui-component/CircularLoader";
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
const EngagementTable = () => {
  const tableData = useSelector(selectEmailEngagementTable || []);
  const [getAllListDetails, setAllListDetails] = useState(tableData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState({
    copy: false,
    count: false,
    delete: false,
  });
  const [rowData, setRowData] = useState([]);
  const [segnmentDetail, setSegnmentDetail] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [myData, setMyData] = useState(getAllListDetails);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = myData?.slice(startIndex, endIndex);
  const dispatch = useDispatch();
  console.log(tableData, "tableDatatableData");
  useEffect(() => {
    if (tableData?.length === 0) {
      setTimeout(getData, 300);
    }
  }, [currentPage]);
  useEffect(() => {
    if (!isDrawerOpen) {
      setRowData({});
    }
  }, [isDrawerOpen]);

  const openDrawer = () => {
    setIsDrawerOpen(true);
    setRowData([]);
  };

  const onsubmit = () => {
    setTimeout(getData, 300);
  };

  const getData = async () => {
    setIsLoading(true);
    const data = await getEngagementData();
    if (data) {
      setAllListDetails(data?.records);
      setMyData(data?.records);
      dispatch(setEmailEngagementTable(data?.records));
      setIsLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const res = engagementDelete(id);
    if (res) {
      setOpenDialog({ delete: false });
      setTimeout(() => {
        getData();
      }, 300);
    }
  };
  const handleSearch = (searchTerm) => {
    const filteredData = getAllListDetails?.filter((item) =>
      item?.list_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMyData(filteredData);
    setCurrentPage(1);
  };
  const handleEdit = (data) => {
    setRowData(data);
    setIsDrawerOpen(true);
  };
  const handleCountRefresh = async (segmentid) => {
    const data = await engagementCountRefresh(segmentid);
    if (data) {
      setOpenDialog({ count: false });
      setTimeout(() => {
        getData();
      }, 300);
    }
  };
  const handelCopyEngagement = async (row) => {
    const data = await engagementCopy(row);
    if (data) {
      setOpenDialog({ copy: false });
      setTimeout(() => {
        getData();
      }, 300);
    }
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
        }}
      >
        {isLoading ? (
            <Box
            sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <CircularLoader/>
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
                    S.No.
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Segment ID
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    List Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Segment Name
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
                  <TableCell style={{ ...headerCellStyle }}>
                    Count
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(itemsToDisplay) &&
                itemsToDisplay.length !== 0 ? (
                  Array?.from(itemsToDisplay)?.map((row, index) => (
                    <CustomTableRow key={row.s_no} index={index}>
                      <TableCell>{row?.s_no}</TableCell>
                      <TableCell>{row?.segmentid}</TableCell>
                      <TableCell>{row?.list_name}</TableCell>
                      <TableCell>{row?.segment_name}</TableCell>
                      <TableCell>{row?.created_by_name}</TableCell>
                      {/* <TableCell>{row.created_by_name}</TableCell> */}
                      <TableCell>{row?.create_date}</TableCell>
                      <TableCell>{row?.count ?? "null"}</TableCell>
                      <TableCell sx={{ padding: "0px 0px" }}>
                        <LightTooltip title="Count">
                          <IconButton
                            onClick={() => {
                              setOpenDialog({ count: true });

                              setSegnmentDetail(row);
                            }}
                            style={{ color: "red" }}
                            aria-label="edit"
                          >
                            <CalculateOutlinedIcon />
                          </IconButton>
                        </LightTooltip>
                        {console.log(row.segment_name === "All Records")}
                        {row?.segment_name !== "All Records" ? (
                          <>
                            <LightTooltip title="Edit">
                              <IconButton
                                style={{ color: "#4E99F5" }}
                                aria-label="edit"
                              >
                                <EditIcon
                                  onClick={() => {
                                    console.log(row);
                                    handleEdit(row);
                                  }}
                                />
                              </IconButton>
                            </LightTooltip>
                            <LightTooltip title="Delete">
                              <IconButton
                                onClick={() => {
                                  setSegnmentDetail(row);

                                  setOpenDialog({
                                    delete: true,
                                  });
                                }}
                                style={{ color: "#404347" }}
                                aria-label="delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </LightTooltip>
                            <LightTooltip title="Copy">
                              <IconButton
                                onClick={() => {
                                  setSegnmentDetail(row);
                                  setOpenDialog({
                                    copy: true,
                                  });
                                }}
                                style={{ color: "#404347" }}
                                aria-label="delete"
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            </LightTooltip>
                          </>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </CustomTableRow>
                  ))
                ) : (
                  <TableRow sx={{ height: "50vh" }}>
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
            count={Math?.ceil(getAllListDetails?.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Stack>
      {isDrawerOpen && (
        <CreateSegment
          segnmentCategory={"emailengagement"}
          getDataRender={getData}
          onClose={onsubmit}
          defaultValues={rowData}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      )}
      <ConfirmationDialog
        open={openDialog.delete}
        handleClose={() => setOpenDialog({ delete: false })}
        title={`${segnmentDetail?.segment_name}`}
        content="Are you sure you want to Delete this list?"
        onConfirm={() => handleDelete(segnmentDetail?.segmentid)}
        confirmText="Delete"
      />
      <ConfirmationDialog
        open={openDialog.count}
        handleClose={() => setOpenDialog({ count: false })}
        title={`${segnmentDetail?.segment_name}`}
        content="Are you sure you want to Count this list?"
        onConfirm={() => handleCountRefresh(segnmentDetail?.segmentid)}
        confirmText="Count"
      />{" "}
      {console.log(segnmentDetail)}
      <ConfirmationDialog
        open={openDialog.copy}
        handleClose={() => setOpenDialog({ copy: false })}
        title={`${segnmentDetail?.segment_name}`}
        content="Are you sure you want to Copy this list?"
        onConfirm={() => handelCopyEngagement(segnmentDetail)}
        confirmText="Copy"
      />
    </>
  );
};
export default EngagementTable;
