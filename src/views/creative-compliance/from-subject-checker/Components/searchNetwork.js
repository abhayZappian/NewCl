import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { useFormik } from "formik";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const SearchNetwork = ({ searchopen, setSearchOpen }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "65%",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
  };

  const handleClose = () => {
    setSearchOpen(false);
    formik.resetForm();
    setSubmittedValues(null);
    setNetworks([]);
  };
  const [submit, setSubmit] = useState(false);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [networks, setNetworks] = useState([]);
  //console.log(networks, "gydgyd");

  const searchNetwork = async (data) => {
    try {
      const res = await axiosInstance.post(apiEndPoints.searchAssest, data);
      //console.log(res.data, "api");
      setNetworks(res?.data || []);
    } catch (error) {
      //console.error(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      searchType: "",
      searchData: "",
    },
    onSubmit: (values) => {
      const data = {
        searchType: values?.searchType,
        searchData: values?.searchData.split("\n").map((item) => item.trim()),
      };
      searchNetwork(data);
      //console.log(data, "data");
      setSubmit(true);
      setSubmittedValues(data);
    },
  });

  const assetName = [
    { label: "From Name", value: "fromName" },
    { label: "Subject Line", value: "subjectLine" },
  ];

  return (
    <Modal
      open={searchopen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h2" sx={{ mb: 2 }}>
              Search Assets
            </Typography>
            <Button onClick={handleClose} variant="contained" sx={{ mb: 2 }}>
              <CloseIcon />
            </Button>
          </Box>

          <Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontSize: "16px" }}>
                Assets Name
              </Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={assetName}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) =>
                  formik.setFieldValue(
                    "searchType",
                    newValue ? newValue.value : ""
                  )
                }
                sx={{ mt: 0.5 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Assets Name"
                    fullWidth
                    value={formik.values.searchType}
                  />
                )}
              />
              <Typography variant="h6" sx={{ mt: 2, fontSize: "16px" }}>
                Check Assets
              </Typography>
              <TextField
                id="outlined-basic"
                label="Search Assets"
                variant="outlined"
                sx={{ mt: 0.5 }}
                multiline
                rows={4}
                fullWidth
                name="searchData"
                value={formik.values.searchData}
                onChange={formik.handleChange}
              />
              <Box sx={{ mt: 3, maxHeight: "40vh", overflowY: "auto" }}>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow sx={{ width: "100%" }}>
                        <TableCell sx={{ width: "50%" }}>
                          <Typography variant="h6" sx={{ fontSize: "15.5px" }}>
                            Assets Name
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: "50%" }}>
                          <Typography variant="h6" sx={{ fontSize: "15.5px" }}>
                            Networks Name
                          </Typography>
                        </TableCell>
                      </TableRow>
                      {submit &&
                        submittedValues?.searchData?.map((asset, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography
                                variant="h6"
                                sx={{ fontSize: "14px" }}
                              >
                                {asset}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {networks?.data &&
                                networks?.data[index] &&
                                networks?.data[index]?.networks?.length > 0 && (
                                  <Typography
                                    variant="h6"
                                    sx={{ fontSize: "14px" }}
                                  >
                                    {networks.data[index].networks.join(", ")}
                                  </Typography>
                                )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 5,
                  width: {
                    sm: "100%",
                    lg: "60%",
                  },
                }}
              >
                <Button variant="contained" type="submit" fullWidth>
                  Search Networks
                </Button>
                <Button variant="outlined" onClick={handleClose} fullWidth>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};

export default SearchNetwork;
