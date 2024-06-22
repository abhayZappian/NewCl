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
  IconButton,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import ListDrawer from "./drawer";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";
import ConfirmationDialog from "../../../../ui-component/conformationModel/index";
import { Box } from "@mui/system";
import apiEndPoints from "helpers/APIEndPoints";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import RecordTable from "./recordTable";
import Upload from "./upload";
import Update from "./update";
import jsPDF from "jspdf";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDispatch, useSelector } from "react-redux";
import { setListTable } from "store/action/dataManagement";
import { selectListTable } from "store/selectors";
import CircularLoader from "ui-component/CircularLoader";
import { mdiFilePdfBox } from "@mdi/js";
import Icon from "@mdi/react";

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

const ListTable = () => {
  const tableData = useSelector(selectListTable || []);
  const [getAllListDetails, setAllListDetails] = useState(tableData);
  const [rowData, setRowData] = useState({});
  const [myData, setMyData] = useState(getAllListDetails);
  const [listName, setlistName] = useState({ name: "", id: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUDialog, setOpenUDialog] = useState(false);
  const [isGDrawerOpen, setIsGDrawerOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(apiEndPoints.allListDetails);
      setAllListDetails(data.result);
      setMyData(data.result);
      dispatch(setListTable(data?.result));
      setIsLoading(false);
    } catch (error) {
      enqueueSnackbar(`error`, {
        variant: "error",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (tableData.length === 0) {
      setTimeout(getData, 300);
    }
  }, []);

  const handleAction = async (id, message) => {
    try {
      await axiosInstance.put(`${apiEndPoints.deleteList}/${id}`);
      enqueueSnackbar(message, {
        variant: "success",
      });
      setTimeout(() => {
        getData();
      }, 300);
    } catch (error) {
      enqueueSnackbar(`Error deleting list`, {
        variant: "error",
      });
    }
  };

  const action = (id) => {
    if (id) {
      handleAction(listName.id, "List Deleted Successfully !!!");
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
  console.log(itemsToDisplay, "itemsToDisplayitemsToDisplay");

  const openDrawer = () => {
    setIsDrawerOpen(true);
    setRowData({});
  };

  const openDialogDrawer = (data) => {
    setOpenDialog(true);
    setRowData(data);
  };

  const openUDialogDrawer = (data) => {
    setOpenUDialog(true);
    setRowData(data);
  };

  const openGDrawer = (data) => {
    setIsGDrawerOpen(true);
    setRowData(data);
  };

  const handleEdit = (data) => {
    setRowData(data);
    setEdit(true);
    setIsDrawerOpen(true);
  };

  const openPdfFile = (data) => {
    console.log(data, "data");
    const pdfDoc = `<html>
    <head>
      <style>
            /* Material-UI Table Styles */
            .mui-table {
                border-collapse: collapse;
                width: 100%;
            }

            .mui-table th,
            .mui-table td {
                border: 1px solid #ddd;
                padding: 8px;
            }

            .mui-table th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
    <div style="font-family:arial; background:#fff; width:100%;">
     <div style="background:#3234ad; color:#fff; padding:15px 1rem; font-size:1.5rem">
        <b>Campaign-Labs List API Document</b>
     </div>
     <br/>
     <div style="margin:0 2rem;">
      <p>Use POST request to send data with a JSON body. Please find the details and example down below:</p>
      <br>
      <table class="mui-table">
                  
                    <tr>
                        <th>API Url:</th>
                        <td>${data?.url}</td>

                    </tr>
                    <tr>
                        <th>API Method:</th>
                        <td>POST</td>
                    </tr>
                    <tr>
                        <th>API Headers:</th>
                        <td>
                        <div><b>userKey</b>       :&nbsp ${data?.userKey}</div>
                        <div><b>userPassword</b>  :&nbsp ${
                          data?.userPassword
                        }</div>
                        <div><b>Content-Type</b> :&nbsp application/json</div>

                        </td>
                    </tr>
                    <tr>
                        <th>Data Minimum Limit:</th>
                        <td>1 Record</td>
                    </tr>
                    <tr>
                        <th>Data Maximum Limit:</th>
                        <td>1000 Records</td>
                    </tr>
                </table>

       <h4>DATA FIELDS:</h4> 
       
       <table class="mui-table">
                <tr style="background:#333;color:#fff;font-weight:bold;">
                    <th style="background:#333;color:#fff;font-weight:bold;">Field Name</th>
                    <th style="background:#333;color:#fff;font-weight:bold;">Required/Optional</th>
                    <th style="background:#333;color:#fff;font-weight:bold;">Type</th>
                </tr>
                <tr>
                    <td>email</td>
                    <td><b>Required*</b></td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>firstname</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>lastname</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>address1</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>city</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>state</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>country</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>zipcode</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>homephone</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>mobile</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
                <tr>
                    <td>gender</td>
                    <td>Optional</td>
                    <td>String</td>
                </tr>
              
            </table>
       <hr> 
       <h4>Data Example</h4> 
       <table class="mui-table">
        <tr>
          <td><b>API Url:</b></td>
          <td>${data?.url}</td>
        </tr>
        <tr>
          <td><b>API Method:</b></td>
          <td>POST</td>
        </tr>
        <tr>
          <td valign="top"><b>API Headers:</b></td>
          <td>
          <div>{"userKey": "XXXX","userPassword": "XXXXXXXXXX"}</div>
          </td>
        </tr>
        <tr>
          <td valign="top"><b>Data:</b></td>
          <td>
            <h4>Multiple Records/Collection of JSON</h4>
            ${JSON.stringify(data)}<br>
           
          </td>
        </tr>
        <tr>
          <td valign="top"><b>Response:</b></td>
          <td>{"success": 1}</td>
        </tr>
      </table>

       <h4>Support:</h4> 
       <p>If you have any further question or if you require any assistance – We’re here to help you:</p>
       <p><b>Slack:</b> Atharva Kulkarni</p><p><b>Email:</b> atharva@zappian.com</p>
       </div>
       </div>
       </body>
       </html>
    </html>`;

    setTimeout(() => {
      let printWindow = window.open("", "_blank");
      let printDocument = printWindow?.document;
      if (printDocument) {
        printDocument.write(`
              <!DOCTYPE html>
              <html>
              <head>
                  <style>
                      @page {
                          size: A3;
                      }
                  </style>
              </head>
              <body>
                  ${pdfDoc}
              </body>
              </html>
          `);
        printDocument.close();
        printWindow?.print();
      }
    }, 1000);
  };
  // Call the function when needed, for example, on a button click
  const handlePdfButtonClick = (data) => {
    openPdfFile(data);
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
                  <TableCell style={{ ...headerCellStyle }}>
                    S.No
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, height: "50px" }}
                  >
                    List ID
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    List Name
                    <span style={dividerStyle}></span>
                  </TableCell>

                  <TableCell style={{ ...headerCellStyle }}>
                    Records
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
                      <TableCell>{row.records}</TableCell>
                      <TableCell>{row.create_date}</TableCell>
                      <TableCell>{row.created_by_name}</TableCell>
                      <TableCell sx={{ padding: "0px 0px" }}>
                        {/* <LightTooltip title="Records">
                          <IconButton
                            style={{ color: "blue" }}
                            aria-label="records"
                            onClick={() => openDialogDrawer(row)}
                          >
                            <FormatListBulletedIcon />
                          </IconButton>
                        </LightTooltip> */}
                        <LightTooltip title="Upload">
                          <IconButton
                            style={{ color: "orange" }}
                            aria-label="uploads"
                            onClick={() => openGDrawer(row)}
                          >
                            <UploadIcon />
                          </IconButton>
                        </LightTooltip>{" "}
                        {/* <LightTooltip title="remove data">
                        <IconButton
                          style={{ color: "red" }}
                          aria-label="edit"
                          onClick={() => openUDialogDrawer(row)}
                        >
                          <DoNotDisturbOnOutlinedIcon />
                        </IconButton>
                      </LightTooltip> */}
                        <LightTooltip title="Edit">
                          <IconButton
                            style={{ color: "#4E99F5" }}
                            aria-label="edit"
                            onClick={() => handleEdit(row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </LightTooltip>
                        <LightTooltip title="Delete">
                          <IconButton
                            style={{ color: "#404347" }}
                            aria-label="delete"
                            onClick={() => {
                              setlistName({
                                name: row.list_name,
                                id: row.listid,
                              });
                              setOpenDelete(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </LightTooltip>
                        <LightTooltip title="PDF">
                          <IconButton
                            onClick={() =>
                              handlePdfButtonClick(JSON.parse(row.apiDoc))
                            }
                            style={{ color: "#404347" }}
                            aria-label="pdf"
                          >
                            <Icon path={mdiFilePdfBox} size={1} />
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
            count={Math.ceil(getAllListDetails.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Stack>
      <ListDrawer
        getDataRender={getData}
        defaultValues={rowData}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        isEdit={isEdit}
        setEdit={setEdit}
      />
      {openDialog && (
        <RecordTable
          getDataRender={getData}
          defaultValues={rowData}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )}
      <Update
        getDataRender={getData}
        defaultValues={rowData}
        openUDialog={openUDialog}
        setOpenUDialog={setOpenUDialog}
      />
      {isGDrawerOpen && (
        <Upload
          getDataRender={getData}
          defaultValues={rowData}
          isGDrawerOpen={isGDrawerOpen}
          setIsGDrawerOpen={setIsGDrawerOpen}
        />
      )}

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

export default ListTable;
