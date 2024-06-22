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
import DeleteIcon from "@mui/icons-material/Delete";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import PowerIcon from "@mui/icons-material/Power";
import VerticalDrawer from "./drawer";
import TemplateModel from "./TemplateModel";
import { Box, Stack, styled } from "@mui/system";
import ConfirmationDialog from "../../../../ui-component/conformationModel/index";
import AddIcon from "@mui/icons-material/Add";
import {
  handleTemplateAction,
  templateAllDetail,
} from "services/presets/template";
import { useDispatch, useSelector } from "react-redux";
import { selectTemplateTable } from "store/selectors";
import { setTemplateTable } from "store/action/journeyCanvas";
import CircularLoader from "ui-component/CircularLoader";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

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
export default function TemplateTable() {
  const [rowData, setRowData] = useState({});
  const [openActive, setOpenActive] = useState({
    delete: false,
    active: false,
    inactive: false,
    drawer: false,
    isLoading: true,
    templateModel: false,
  });
  const [templateId, setTemplateId] = useState({ name: "", id: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [templateDetails, setTemplateDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const templateTable = useSelector(selectTemplateTable) || [];

  const openDrawer = () => {
    setRowData({});
    setOpenActive({ drawer: true });
  };
  const getData = async () => {
    setOpenActive({ isLoading: true });
    const data = await templateAllDetail();
    setTemplateDetails(data?.result);
    setData(data?.result);
    dispatch(setTemplateTable(data?.result));
    setOpenActive({ isLoading: false });
  };

  useEffect(() => {
    if (templateTable.length === 0) {
      getData();
    } else {
      setData(templateTable);
      setOpenActive({ isLoading: false });
    }
  }, []);

  const handleAction = async (id, actionType, message) => {
    const res = await handleTemplateAction(id, actionType, message);
    setTimeout(() => {
      getData();
    }, 200);
  };
  const action = (id, action) => {
    switch (true) {
      case action === "0":
        if (id) {
          handleAction(
            templateId.id,
            "0",
            "Template In-Active Successfully !!!"
          );
        }
        break;
      case action === "1":
        if (id) {
          handleAction(templateId.id, "1", "Template Active Successfully !!!");
        }
        break;
      default:
        if (id) {
          handleAction(templateId.id, "2", "Template Deleted Successfully !!!");
        }
    }
    setOpenActive(false);
  };
  const handleEdit = (data) => {
    setRowData(data);
    setOpenActive({ drawer: true });
  };
  const openTemplateModel = (data) => {
    setRowData(data);
    setOpenActive({ templateModel: true });
  };
  const itemsPerPage = 10;

  const handleSearch = (searchTerm) => {
    const filteredData = templateDetails?.filter((item) =>
      item?.template_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(setTemplateTable(filteredData));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = templateTable?.slice(startIndex, endIndex);

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
        {openActive.isLoading ? (
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
                  <TableCell align="left" style={{ ...headerCellStyle }}>
                    Name
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>
                    Created By
                    <span style={dividerStyle}></span>
                  </TableCell>

                  <TableCell style={{ ...headerCellStyle }}>
                    Creation Date
                    <span style={dividerStyle}></span>
                  </TableCell>
                  <TableCell style={{ ...headerCellStyle }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsToDisplay && itemsToDisplay.length > 0 ? (
                  itemsToDisplay?.map((row, index) => (
                    <CustomTableRow key={row.id} index={index}>
                      <TableCell>{row.s_no}</TableCell>
                      <TableCell>{row.template_name}</TableCell>
                      <TableCell>{row.creator_name}</TableCell>
                      <TableCell>{row.create_date}</TableCell>
                      <TableCell sx={{ padding: "0px" }}>
                        <LightTooltip title="Edit">
                          <IconButton
                            style={{ color: "#4e99f5" }}
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
                                  setTemplateId({
                                    name: row.template_name,
                                    id: row.id,
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
                          <>
                            <LightTooltip title="Active">
                              <IconButton
                                onClick={() => {
                                  setTemplateId({
                                    name: row.template_name,
                                    id: row.id,
                                  });
                                  setOpenActive({ active: "true" });
                                }}
                                style={{ color: "green" }}
                                aria-label="active"
                              >
                                <PowerIcon />
                              </IconButton>
                            </LightTooltip>
                          </>
                        ) : (
                          <>
                            <LightTooltip title="In-Active">
                              <IconButton
                                onClick={() => {
                                  setTemplateId({
                                    name: row.template_name,
                                    id: row.id,
                                  });
                                  setOpenActive({ inactive: true });
                                }}
                                style={{ color: "red" }}
                                aria-label="active"
                              >
                                <PowerOffIcon />
                              </IconButton>
                            </LightTooltip>
                          </>
                        )}
                        <LightTooltip title="Preview">
                          <IconButton
                            style={{ color: "#4e99f5" }}
                            aria-label="edit"
                          >
                            <RemoveRedEyeIcon
                              onClick={() => {
                                openTemplateModel(row);
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
        defaultValues={rowData}
        onClose={onsubmit}
        getDataRender={getData}
        openActive={openActive.drawer}
        setOpenActive={setOpenActive}
      />
      <TemplateModel
        defaultValues={rowData}
        onClose={onsubmit}
        getDataRender={getData}
        openActive={openActive.templateModel}
        setOpenActive={setOpenActive}
      />
      <ConfirmationDialog
        open={openActive.delete}
        handleClose={action}
        title={`${templateId.name}`}
        content="Are you sure you want to Delete this template?"
        onConfirm={() => action(templateId.id, "2")}
        confirmText="Delete"
      />
      <ConfirmationDialog
        open={openActive.active}
        handleClose={action}
        title={`${templateId.name}`}
        content="Are you sure you want to In-active this template ?"
        onConfirm={() => action(templateId.id, "0")}
        confirmText="In-Active"
      />
      <ConfirmationDialog
        open={openActive.inactive}
        handleClose={action}
        title={`${templateId.name}`}
        content="Are you sure you want to active this template?"
        onConfirm={() => action(templateId.id, "1")}
        confirmText="Active"
      />
    </>
  );
}
