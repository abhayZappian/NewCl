import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import Suppression from "./surpression";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";
import ConfirmationDialog from "../../../../ui-component/conformationModel/index";
import { Box, styled } from "@mui/system";
import apiEndPoints from "helpers/APIEndPoints";
import AddIcon from "@mui/icons-material/Add";
import GlobalSuppression from "./globalSurpression";
import UploadIcon from "@mui/icons-material/Upload";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import Upload from "./upload";
import Update from "./update";
import { useDispatch, useSelector } from "react-redux";
import { selectSupressionTable } from "store/selectors";
import { setSupressionTable } from "store/action/dataManagement";
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

const SupressionTable = () => {
  const tableData = useSelector(selectSupressionTable || []);
  const [getAllListDetails, setAllListDetails] = useState(tableData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGDrawerOpen, setIsGDrawerOpen] = useState(false);
  const [isUDrawerOpen, setIsUDrawerOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowData, setRowData] = useState({});
  const [listName, setListName] = useState({ name: "", id: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [myData, setMyData] = useState(getAllListDetails);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const getData = async () => {
    setIsLoading(true);
    const { data } = await axiosInstance.get(
      apiEndPoints?.allSuppressionListDetails
    );
    setAllListDetails(data?.result);
    setMyData(data?.result);
    dispatch(setSupressionTable(data?.result));
    setIsLoading(false);
  };
  console.log(tableData, "tableDatatableData");
  useEffect(() => {
    if (tableData.length === 0) {
      setTimeout(getData, 300);
    }
  }, [currentPage]);

  const handleAction = async (id, actionType, message) => {
    const data = {
      action: actionType,
    };
    const res = await axiosInstance.put(
      `${apiEndPoints.deleteSuppressionList}/${id}`,
      data
    );
    enqueueSnackbar(message, {
      variant: "success",
    });
    setTimeout(() => {
      getData();
    }, 300);
  };

  const action = (id) => {
    if (id) {
      handleAction(
        listName.id,
        "2",
        "Surpression List Deleted Successfully !!!"
      );
    }
    setOpenDelete(false);
  };

  const itemsPerPage = 10;

  const handleSearch = (searchTerm) => {
    const filteredData = getAllListDetails?.filter((item) =>
      item?.list_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMyData(filteredData);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = myData?.slice(startIndex, endIndex);
  console.log(itemsToDisplay, "itemsToDisplay");
  const openDrawer = () => {
    setIsDrawerOpen(true);
    setRowData({});
  };

  const openDialogDrawer = (data) => {
    setOpenDialog(true);
    setRowData(data);
  };

  const openGDrawer = () => {
    setIsGDrawerOpen(true);
  };

  const openUDrawer = (data) => {
    setIsUDrawerOpen(true);
    setRowData(data);
  };

  const onsubmit = () => {
    setTimeout(getData, 300);
  };

  const handleEdit = (data) => {
    setRowData(data);
    setEdit(true);
    setIsDrawerOpen(true);
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
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{ backgroundColor: "#FF831F", textTransform: "capitalize" }}
            onClick={openGDrawer}
          >
            GlobalSuppression
          </Button>
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
                    S.No <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Suppression Id <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Suppression Name<span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Suppression Type<span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Data Type<span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Total Records<span style={dividerStyle}></span>
                  </TableCell>

                  <TableCell style={{ ...headerCellStyle }}>
                    Created By<span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Created At<span style={dividerStyle}></span>
                  </TableCell>

                  <TableCell style={{ ...headerCellStyle }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(itemsToDisplay).length > 0 ? (
                  Array.from(itemsToDisplay).map((row, index) => (
                    <CustomTableRow key={row.listid} index={index}>
                      <TableCell>{row.s_no}</TableCell>
                      <TableCell>{row.listid}</TableCell>
                      <TableCell>{row.list_name}</TableCell>
                      <TableCell>{row.list_type}</TableCell>
                      <TableCell>{row.list_data_type}</TableCell>
                      <TableCell>{row.records}</TableCell>
                      <TableCell>{row.created_by_name}</TableCell>
                      <TableCell>{row.create_date}</TableCell>

                      <TableCell sx={{ padding: "0px 0px" }}>
                        <LightTooltip title="Uploads">
                          <IconButton
                            onClick={() => {}}
                            style={{ color: "orange" }}
                            aria-label="uploads"
                          >
                            <UploadIcon onClick={() => openUDrawer(row)} />
                          </IconButton>
                        </LightTooltip>{" "}
                        <LightTooltip title="Remove Data">
                          <IconButton
                            onClick={() => {}}
                            style={{ color: "red" }}
                            aria-label="edit"
                          >
                            <DoNotDisturbOnOutlinedIcon
                              onClick={() => openDialogDrawer(row)}
                            />
                          </IconButton>
                        </LightTooltip>
                        <LightTooltip title="Edit">
                          <IconButton
                            style={{ color: "#4E99F5" }}
                            aria-label="edit"
                          >
                            <EditIcon onClick={() => handleEdit(row)} />
                          </IconButton>
                        </LightTooltip>
                        <LightTooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setListName({
                                name: row.list_name,
                                id: row.listid,
                              });
                              setOpenDelete(true);
                            }}
                            style={{ color: "#404347" }}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </LightTooltip>
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
            count={Math.ceil(getAllListDetails.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Stack>

      <Suppression
        getDataRender={getData}
        onClose={onsubmit}
        defaultValues={rowData}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        isEdit={isEdit}
        setEdit={setEdit}
      />
      <GlobalSuppression
        getDataRender={getData}
        onClose={onsubmit}
        defaultValues={rowData}
        isGDrawerOpen={isGDrawerOpen}
        setIsGDrawerOpen={setIsGDrawerOpen}
      />
      <Update
        getDataRender={getData}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        defaultValues={rowData}
      />
      <Upload
        getDataRender={getData}
        onClose={onsubmit}
        defaultValues={rowData}
        isUDrawerOpen={isUDrawerOpen}
        setIsUDrawerOpen={setIsUDrawerOpen}
      />
      <ConfirmationDialog
        open={openDelete}
        handleClose={action}
        title={`${listName.name}`}
        content="Are you sure you want to Delete this list?"
        onConfirm={() => action(listName.id, "2")}
        confirmText="Delete"
      />
    </>
  );
};

export default SupressionTable;
