import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const validationSchema = Yup.object().shape({
  list_name: Yup.string().required("List name  Required"),
  countryId: Yup.mixed().required("Country  Required"),
  data_type: Yup.mixed().required("Data Type  Required"),
  list_type: Yup.mixed().required("List Type  Required"),
  // suppression_list: Yup.mixed().required("Suppression List  Required"),
  suppression_list: Yup.mixed().when("list_type", {
    is: (val) => val && val.label === "offer",
    then: Yup.mixed().required("Suppression List Required"),
    otherwise: Yup.mixed().notRequired(),
  }),
});

const Suppression = ({
  defaultValues,
  isDrawerOpen,
  setIsDrawerOpen,
  getDataRender,
  isEdit,
  setEdit,
}) => {
  const [listNameError, setListNameError] = useState("");
  const [receivedData, setReceivedData] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const [disableButton, setdisableButton] = useState(false);

  const [types, setTypes] = useState({
    countryList: [],
    dataTypes: [],
    listTypes: [],
    suppressionTypes: [],
  });
  const countryList = types.countryList || [];

  const defaultValueslength = Object.keys(defaultValues).length;
  const serializedObject = localStorage?.getItem("userInfo");
  const myObject = JSON.parse(serializedObject);
  const createdByName = myObject?.name;
  const createdBy = myObject?.id;

  const checkListNameExists = async (listName) => {
    try {
      const response = await axiosInstance.post(
        apiEndPoints.checkSuppressionListNameExistence,
        { list_name: listName }
      );
      setListNameError(
        response.data.status
          ? "List name already exists for this name is in deleted list so please use different name."
          : ""
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleListNameChange = async (event) => {
    const listName = event.target.value;

    if (listName) {
      await checkListNameExists(listName);
    }
  };

  const getCountryName = async () => {
    try {
      const response = await axiosInstance.get(apiEndPoints.getAllCountries);
      setTypes((prevTypes) => ({
        ...prevTypes,
        countryList: response.data.allCountries,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getDataTypes = async () => {
    try {
      const response = await axiosInstance.get(apiEndPoints.dataTypes);
      setTypes((prevTypes) => ({
        ...prevTypes,
        dataTypes: response.data.dataTypes,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getsuppressionTypes = async () => {
    try {
      const response = await axiosInstance.get(apiEndPoints.suppressoinList);
      setTypes((prevTypes) => ({
        ...prevTypes,
        suppressionTypes: response.data.suppressionList,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getlistTypes = async () => {
    try {
      const response = await axiosInstance.get(apiEndPoints.listTypes);
      setTypes((prevTypes) => ({
        ...prevTypes,
        listTypes: response.data.listTypes,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (countryList.length === 0) {
      getCountryName();
    }
  }, [countryList]);

  useEffect(() => {
    if (types.dataTypes.length === 0) {
      getDataTypes();
    }
  }, [types.dataTypes]);

  useEffect(() => {
    if (types.suppressionTypes.length === 0) {
      getsuppressionTypes();
    }
  }, [types.suppressionTypes]);

  useEffect(() => {
    if (types.listTypes.length === 0) {
      getlistTypes();
    }
  }, [types.listTypes]);

  const setFieldValues = (values) => {
    formik.setFieldValue("list_name", defaultValues?.list_name);
    formik.setFieldValue("countryId", {
      countryName: defaultValues.country_name,
      countryId: defaultValues.country_id,
    });
  };

  useEffect(() => {
    setReceivedData(defaultValues);
    if (defaultValues && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    }
  }, [defaultValues]);

  const addList = async (values) => {
    try {
      const data = new FormData();
      data.append("created_by", createdBy);
      data.append("created_by_name", createdByName);
      data.append("list_name", values.list_name);
      data.append("list_data_type", values.data_type?.label);
      data.append("list_type", values.list_type["value"]);
      data.append("country_id", values.countryId?.countryId);
      data.append("country_name", values.countryId?.countryName);
      data.append("suppressionListId", values.suppression_list?.value);
      data.append("suppressionListName", values.suppression_list?.label);
      data.append("csvFile", values.csvFile);

      const response = await axiosInstance.post(
        apiEndPoints.addSuppressionRecord,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      enqueueSnackbar("Form Submit Successfully !!!", {
        variant: "success",
      });

      getDataRender();
      onDrawerClose();
    } catch (error) {
      enqueueSnackbar(`${error?.response?.data?.msg}`, {
        variant: "error",
      });
    }
  };

  const updateList = async (values) => {
    try {
      const data = new FormData();
      data.append("edit_by", createdBy);
      data.append("edited_by_name", createdByName);
      data.append("list_name", values.list_name);
      data.append("country_id", values.countryId?.countryId);
      data.append("country_name", values.countryId?.countryName);

      const { res } = await axiosInstance.put(
        `${apiEndPoints.updateSuppressionListName}/${receivedData?.listid}`,
        data
      );

      enqueueSnackbar("Form Updated Successfully !!!", {
        variant: "success",
      });

      getDataRender();
      setIsDrawerOpen(false);
      formik.resetForm();
    } catch (error) {
      enqueueSnackbar(`${error?.response?.data?.msg}`, {
        variant: "error",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      list_name: "",
      countryId: null,
      data_type: null,
      list_type: null,
      suppression_list: null,
      csvFile: null,
    },
    validationSchema: defaultValueslength === 0 ? validationSchema : "",
    onSubmit: (values) => {
      if (defaultValueslength === 0) {
        addList(values);
      } else {
        updateList(values);
      }
    },
  });

  // const onDrawerClose = () => {
  //     setIsDrawerOpen(false);
  //     formik.resetForm();
  //     setSelectedFileName('');
  // };
  useEffect(() => {
    if (isDrawerOpen && !isEdit) {
      formik.resetForm();
    }
  }, [isEdit, isDrawerOpen]);

  const onDrawerClose = () => {
    if (isEdit === true) {
      setSelectedFileName("");
      setIsDrawerOpen(false);
      setEdit(false);
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
      setSelectedFileName("");
      setIsDrawerOpen(false);
    }
  };
  const disableHandler = () => {
    setdisableButton(true);
    setTimeout(() => {
      setdisableButton(false);
    }, 100);
  };

  return (
    <Drawer anchor="right" open={isDrawerOpen}>
      <Box
        sx={{ m: 1, width: "350px", margin: "24px" }}
        noValidate
        autoComplete="off"
      >
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Typography sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
              {defaultValueslength == 0 ? "Add" : "Edit"} List
            </Typography>
            <div>
              <TextField
                label="List Name"
                name="list_name"
                fullWidth
                variant="standard"
                value={formik.values.list_name}
                onChange={async (e) => {
                  formik.handleChange(e);
                  await handleListNameChange(e);
                }}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.list_name && Boolean(formik.errors.list_name)
                }
                helperText={formik.touched.list_name && formik.errors.list_name}
              />
              {listNameError && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {listNameError}
                </div>
              )}
            </div>
            <div style={{ width: "350px" }}>
              <Autocomplete
                sx={{ marginTop: 1 }}
                id="countryId"
                name="countryId"
                options={types.countryList}
                value={formik.values.countryId}
                getOptionLabel={(option) => `${option.countryName} `}
                onChange={(e, newValue) => {
                  formik.setFieldValue("countryId", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Country"
                    variant="standard"
                    error={
                      formik.touched.countryId &&
                      Boolean(formik.errors.countryId)
                    }
                    helperText={
                      formik.touched.countryId && formik.errors.countryId
                    }
                  />
                )}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <Autocomplete
                options={types.dataTypes}
                value={formik.values?.data_type}
                id="data_type"
                name="data_type"
                variant="standard"
                getOptionLabel={(option) => `${option.label} `}
                onChange={(e, newValue) => {
                  formik.setFieldValue("data_type", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="standard"
                    label="Data Type"
                    error={
                      formik.touched.data_type &&
                      Boolean(formik.errors.data_type)
                    }
                    helperText={
                      formik.touched.data_type && formik.errors.data_type
                    }
                    sx={{ display: defaultValueslength > 0 ? "none" : "flex" }}
                  />
                )}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <Autocomplete
                options={types.listTypes}
                value={formik.values.list_type}
                variant="standard"
                getOptionLabel={(option) => `${option.label} `}
                onChange={(_, newValue) => {
                  formik.setFieldValue("list_type", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="standard"
                    label="Suppression List Type"
                    error={
                      formik.touched.list_type &&
                      Boolean(formik.errors.list_type)
                    }
                    helperText={
                      formik.touched.list_type && formik.errors.list_type
                    }
                    sx={{ display: defaultValueslength > 0 ? "none" : "flex" }}
                  />
                )}
              />
            </div>
            {formik.values.list_type?.label === "offer" && (
              <div style={{ marginTop: "10px" }}>
                <Autocomplete
                  options={types.suppressionTypes}
                  value={formik.values.suppression_list}
                  variant="standard"
                  getOptionLabel={(option) => `${option.label} `}
                  onChange={(_, newValue) => {
                    formik.setFieldValue("suppression_list", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="standard"
                      label=" Campagin Labs Suppression List Mapping On Suppres.Io"
                      error={
                        formik.touched.suppression_list &&
                        Boolean(formik.errors.suppression_list)
                      }
                      helperText={
                        formik.touched.suppression_list &&
                        formik.errors.suppression_list
                      }
                      sx={{
                        display: defaultValueslength > 0 ? "none" : "flex",
                      }}
                    />
                  )}
                />
              </div>
            )}

            <div
              style={{
                marginTop: "25px",
                display: defaultValueslength > 0 ? "none" : "block",
              }}
            >
              <Button
                disabled={disableButton === true}
                onClick={() => {
                  disableHandler();
                }}
                component="label"
                variant="contained"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#E9EEFF",
                  color: "#000",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
                type="file"
                accept=".csv"
                onChange={(event) => {
                  const selectedFile = event.currentTarget.files[0];
                  if (selectedFile && selectedFile.type !== "text/csv") {
                    enqueueSnackbar("Please select only .csv files.", {
                      variant: "error",
                    });
                    event.target.value = null;
                  } else {
                    formik.setFieldValue("csvFile", selectedFile);
                    setSelectedFileName(selectedFile ? selectedFile.name : "");
                  }
                }}
              >
                {selectedFileName ? selectedFileName : "Upload file"}
                <VisuallyHiddenInput
                  type="file"
                  accept=".csv"
                  onChange={(event) => {
                    const selectedFile = event.currentTarget.files[0];
                    if (selectedFile && selectedFile.type !== "text/csv") {
                      enqueueSnackbar("Please select only .csv files.", {
                        variant: "error",
                      });
                      event.target.value = null;
                    } else {
                      formik.setFieldValue("csvFile", selectedFile);
                      setSelectedFileName(
                        selectedFile ? selectedFile.name : ""
                      );
                    }
                  }}
                />
              </Button>

              <Typography sx={{ display: "inline" }}>
                NOTE:{" "}
                <Typography sx={{ display: "inline", color: "#60E9FF" }}>
                  {" "}
                  Select only{" "}
                  <Typography sx={{ display: "inline", color: "red" }}>
                    {" "}
                    (.csv){" "}
                  </Typography>{" "}
                  file.
                </Typography>
              </Typography>
            </div>
            <div style={{ marginTop: "10px" }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    onDrawerClose();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </div>
            <Box sx={{ mt: 6 }}>
              <Typography>
                {defaultValueslength == 0
                  ? "***Use following header in file: email"
                  : ""}
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Suppression;
