import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import PowerIcon from "@mui/icons-material/Power";
import { baseURL } from "config/envConfig";
import { useState, useEffect } from "react";
import axiosInstance from "helpers/apiService";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CircularProgress,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
  tooltipClasses,
  Button,
} from "@mui/material";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import VerticalDrawer from "./drawer";
import { Box, Stack, styled } from "@mui/system";
import ConfirmationDialog from "../../../../ui-component/conformationModel/index";
import { enqueueSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import apiEndPoints from "helpers/APIEndPoints";
import { getOfferData, handleActionOffer } from "services/presets/offer";
import { useDispatch, useSelector } from "react-redux";
import { setOfferTable } from "store/action/journeyCanvas";
import { selectOfferTable } from "store/selectors";
import CircularLoader from "../../../../ui-component/CircularLoader";

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

export default function OfferTable() {
  const [openActive, setOpenActive] = useState({
    delete: false,
    active: false,
    inactive: false,
    drawer: false,
  });

  const [offerId, setofferId] = useState({ name: "", id: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState({});
  const dispatch = useDispatch();
  const offerTable = useSelector(selectOfferTable || []);

  useEffect(() => {
    if (offerTable.length === 0) {
      getData();
    } else {
      setData(offerTable);
      setIsLoading(false);
    }
  }, []);

  const getData = async (page) => {
    setIsLoading(true);
    const data = await getOfferData();
    dispatch(setOfferTable(data?.data?.result));
    setData(data?.data?.result);
    setIsLoading(false);
  };

  const handleAction = async (id, actionType, message) => {
    const res = await handleActionOffer(id, actionType, message);
    setTimeout(() => {
      getData();
    }, 300);
  };

  const action = (id, action) => {
    switch (true) {
      case action === "0":
        if (id) {
          handleAction(offerId.id, "0", "Offer In-Active Successfully !!!");
        }
        break;
      case action === "1":
        if (id) {
          handleAction(offerId.id, "1", "Offer Active Successfully !!!");
        }
        break;
      default:
        if (id) {
          handleAction(offerId.id, "2", "Offer Deleted Successfully !!!");
        }
    }
    setOpenActive(false);
  };

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = offerTable?.slice(startIndex, endIndex);

  const handleSearch = (searchTerm) => {
    const filteredData = data?.filter((item) =>
      item?.offer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(setOfferTable(filteredData));
    setCurrentPage(1);
  };

  const openDrawer = () => {
    setRowData({});
    setOpenActive({ drawer: true });
  };

  const handleEdit = (data) => {
    setRowData(data);
    setOpenActive({ drawer: true });
  };

  return (
    <>
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
                    <TableCell
                      align="left"
                      style={{ ...headerCellStyle, height: "50px" }}
                    >
                      S.No
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ ...headerCellStyle, width: "0px" }}
                    >
                      Offer Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Offer ID
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Portal Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Advertiser ID
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Advertiser Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Affiliates ID
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Affiliates Name
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle, width: "0px" }}>
                      URL
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Payout
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Payment Terms
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Created By
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Created At
                      <span style={dividerStyle}></span>
                    </TableCell>
                    <TableCell style={{ ...headerCellStyle }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsToDisplay && itemsToDisplay.length > 0 ? (
                    itemsToDisplay?.map((row, index) => {
                      let networkPortalName = "";

                      if (row.networkPortalList) {
                        try {
                          const parsedNetworkPortalList = JSON.parse(
                            row.networkPortalList
                          );
                          networkPortalName =
                            parsedNetworkPortalList.networkPortalName;
                        } catch (e) {
                          console.error(
                            "Failed to parse networkPortalList:",
                            e
                          );
                        }
                      }

                      return (
                        <CustomTableRow key={row.id} index={index}>
                          <TableCell>{row.s_no}</TableCell>
                          <TableCell>{row.offer_name}</TableCell>
                          <TableCell>{row.offer_id}</TableCell>
                          <TableCell>{networkPortalName}</TableCell>
                          <TableCell>{row.advertiser_id}</TableCell>
                          <TableCell>{row.advertiser_name}</TableCell>
                          <TableCell>{row.EverFlowAffiliatesId}</TableCell>
                          <TableCell>
                            {row.EverFlowAffiliatesName == "null"
                              ? "N/A"
                              : row.EverFlowAffiliatesName}
                          </TableCell>
                          <TableCell>{row.offer_link}</TableCell>
                          <TableCell>{row.payout}</TableCell>
                          <TableCell>{row.payment_type}</TableCell>
                          <TableCell>{row.creator_name}</TableCell>
                          <TableCell>{row.created_on}</TableCell>
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
                            {row.active === 1 ? (
                              <>
                                <LightTooltip title="Delete">
                                  <IconButton
                                    style={{ color: "#cccccc" }}
                                    aria-label="delete"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            ) : (
                              <>
                                <LightTooltip title="Delete">
                                  <IconButton
                                    onClick={() => {
                                      setofferId({
                                        name: row.offer_name,
                                        id: row.offer_id,
                                      });
                                      setOpenActive({ delete: true });
                                    }}
                                    style={{ color: "#404347" }}
                                    aria-label="delete"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </LightTooltip>
                              </>
                            )}

                            {row.active === 1 ? (
                              <LightTooltip title="Active">
                                <IconButton
                                  onClick={() => {
                                    setofferId({
                                      name: row.offer_name,
                                      id: row.offer_id,
                                    });
                                    setOpenActive({ active: true });
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
                                    setofferId({
                                      name: row.offer_name,
                                      id: row.offer_id,
                                    });
                                    setOpenActive({ inactive: true });
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
                      );
                    })
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
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
        <VerticalDrawer
          getDataRender={getData}
          defaultValues={rowData}
          onClose={onsubmit}
          setDefaultValues={setRowData}
          openActive={openActive.drawer}
          setOpenActive={setOpenActive}
        />
        <ConfirmationDialog
          open={openActive.delete}
          handleClose={action}
          title={`${offerId.name}`}
          content="Are you sure you want to Delete this offer?"
          onConfirm={() => action(offerId.id, "2")}
          confirmText="Delete"
        />
        <ConfirmationDialog
          open={openActive.active}
          handleClose={action}
          title={`${offerId.name}`}
          content="Are you sure you want to In-Active this offer?"
          onConfirm={() => action(offerId.id, "0")}
          confirmText="InActive"
        />
        <ConfirmationDialog
          open={openActive.inactive}
          handleClose={action}
          title={`${offerId.name}`}
          content="Are you sure you want to Active this offer?"
          onConfirm={() => action(offerId.id, "1")}
          confirmText="Active"
        />
      </>
    </>
  );
}
