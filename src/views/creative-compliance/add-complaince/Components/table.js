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
  Modal,
  Pagination,
  TextField,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import NetworkListDrawer from "./drawer/drawer";
import { Box, Stack, styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import CircularLoader from "ui-component/CircularLoader";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { getNetworkList } from "services/creativeCompliance/networkCompliance";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DateFormatter from "utils/FormatDateTime";

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
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "90%",
  backgroundColor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
  overflow: "auto",
};
export default function NetworkTable() {
  const [open, setOpen] = useState({
    drawer: false,
    isLoading: true,
  });
  const [rowData, setRowData] = useState({});
  const [data, setData] = useState([]);
  const [networkDetails, setNetworkDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setOpen({ isLoading: true });
      const data = await getNetworkList();
      setData(data?.data);
      setNetworkDetails(data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen({ isLoading: false });
    }
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
  const handleOpen = () => {
    setOpenModal(true);
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
            <Table style={{ width: "100%", overflowX: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Network Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, minWidth: "240px" }}
                  >
                    From Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ ...headerCellStyle, minWidth: "150px" }}
                  >
                    From Name Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "240px" }}>
                    Seasonal From Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "220px" }}>
                    Seasonal From Name Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "550px" }}>
                    Subject Line
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "160px" }}>
                    Subject Line Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "550px" }}>
                    Seasonal Subject Line
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "220px" }}>
                    Seasonal Subject Line Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "180px" }}>
                    Restricted Word
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "180px" }}>
                    Restricted Word Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "160px" }}>
                    Warning Word
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "170px" }}>
                    Warning Word Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "150px" }}>
                    Spam Word
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "150px" }}>
                    Spam Word Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "90px" }}>
                    Footer
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "120px" }}>
                    Footer Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "120px" }}>
                    Created By
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle, minWidth: "130px" }}>
                    Created Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                  itemsToDisplay?.map((row, index) => (
                    <CustomTableRow key={row?.id} index={index}>
                      <TableCell>{row?.networkName}</TableCell>
                      <TableCell>
                        {row?.fromName && row?.fromName[0]} ....
                      </TableCell>
                      <TableCell>{row?.fromNameDate}</TableCell>
                      <TableCell>
                        {row?.seasonalFromName && row?.seasonalFromName[0]}
                      </TableCell>
                      <TableCell>{row?.seasonalFromNameDate}</TableCell>
                      <TableCell>
                        {row?.subjectLine && row?.subjectLine[0]}
                      </TableCell>
                      <TableCell>{row?.subjectLineDate}</TableCell>
                      <TableCell>
                        {row?.seasonalSubjectLine &&
                          row?.seasonalSubjectLine[0]}
                      </TableCell>
                      <TableCell>{row?.seasonalSubjectLineDate}</TableCell>
                      <TableCell>
                        {row?.restrictedWord && row?.restrictedWord[0]}
                      </TableCell>
                      <TableCell>{row?.restrictedWordDate}</TableCell>
                      <TableCell>
                        {row?.warningWord && row?.warningWord[0]}
                      </TableCell>
                      <TableCell>{row?.warningWordDate}</TableCell>
                      <TableCell>{row?.spamWord && row?.spamWord[0]}</TableCell>
                      <TableCell>{row?.spamWordDate}</TableCell>
                      <TableCell>{row?.footer && row?.footer[0]}</TableCell>
                      <TableCell>{row?.footerDate}</TableCell>
                      <TableCell>{row?.createdByName}</TableCell>
                      <TableCell>{row?.networkId}</TableCell>
                      <TableCell
                        sx={{
                          padding: "0px",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <LightTooltip title="View">
                          <IconButton
                            sx={{ color: "black" }}
                            aria-label="view"
                            onClick={() => {
                              setOpenModal(true);
                              setRowData(row);
                              console.log(rowData);
                            }}
                          >
                            <RemoveRedEyeIcon size={2} />
                          </IconButton>
                        </LightTooltip>
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
            count={Math?.ceil(data?.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Stack>
      {open?.drawer && (
        <NetworkListDrawer
          defaultValues={rowData}
          getDataRender={getData}
          open={open.drawer}
          setOpen={setOpen}
        />
      )}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <div style={style}>
          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#FF831F",
            }}
          >
            Close
          </Button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              overflowY: "auto",
              paddingTop: 50,
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: "100%",
                overflowY: "auto",
                maxWidth: "90vw",
              }}
            >
              <Table sx={{ minWidth: "100%" }} aria-label="simple table">
                {/* <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ width: "50%", textAlign: "center" }}
                    >
                      Key
                    </TableCell>
                    <TableCell align="center" sx={{ width: "50%" }}>
                      Value
                    </TableCell>
                  </TableRow>
                </TableHead> */}
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={2}
                      sx={{ textAlign: "center", fontSize: "20px" }}
                    >
                      Details
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(rowData)
                    .filter(
                      ([key]) =>
                        ![
                          "_id",
                          "updatedBy",
                          "active",
                          "networkId",
                          "__v",
                        ].includes(key)
                    )
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            textAlign: "center",
                          }}
                        >
                          {key}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            maxWidth: "70vw",
                          }}
                        >
                          {value?.toString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Modal>
    </>
  );
}
