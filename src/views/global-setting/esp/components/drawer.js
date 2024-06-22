import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { createdByName, createdBy } from "../../../../helpers/userInfo";
import { getESPdetails } from "services/presets/pool";
import { height } from "@mui/system";
import {
  ESPAction,
  addEspAccount,
  editEspAccount,
  getAllEspProviderAccount,
} from "services/adminConsole/esp";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { enqueueSnackbar } from "notistack";

const validationSchema = Yup.object().shape({
  capName: Yup.string()
    .trim()
    .required("Cap Name is required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words"),
  ispsName: Yup.mixed().required("ISPs Name is required"),
  espsIntegrated: Yup.mixed().required("ESPs Integrated is required"),
  espsAccount: Yup.mixed().required("Esps Account is required"),
  capNumber: Yup.string()
    .matches(/^[0-9]+$/, {
      message: "Numbers are allowed without space",
      excludeEmptyString: true,
    })
    .required("Cap Number is required"),
});

const EspDrawer = ({
  defaultValues,
  setDefaultValues,
  addNetworkDataRender,
  isDrawerOpen,
  setIsDrawerOpen,
  getDataRender,
}) => {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [EspList, setEspList] = useState([]);
  const [data, setData] = useState([]);
  const [receivedData, setReceivedData] = useState({});
  const [isps, setIsps] = useState([]);
  const defaultValueslength = Object.keys(defaultValues).length;

  const getIsps = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.getIsps);
    setIsps(data?.result);
  };
  const getESP = async () => {
    const { data } = await getESPdetails();
    setEspList(data);
  };

  const getEspAccount = async (id) => {
    const { data } = await axiosInstance.get(
      `${apiEndPoints.emailServiceProviderAccounts}/${id}`
    );
    setData(data);
  };

  useEffect(() => {
    getESP();
    getIsps();
  }, []);

  const formik = useFormik({
    initialValues: {
      capName: "",
      ispsName: "",
      espsIntegrated: "",
      espsAccount: "",
      capNumber: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (defaultValueslength === 0) {
        const data = {
          capName: values.capName.trim(),
          ispsName: values?.ispsName,
          espsIntegrated: values?.espsIntegrated,
          espsAccount: values?.espsAccount,
          capNumber: Number(values?.capNumber),
          createdByName: createdByName,
          createdBy: createdBy,
        };
        addEspAccountDetail(data);
        setButtonDisabled(true);
      } else {
        const data = {
          capName: values.capName.trim(),
          ispsName: values?.ispsName,
          espsIntegrated: values?.espsIntegrated,
          espsAccount: values?.espsAccount,
          capNumber: Number(values?.capNumber),
          updatedByName: createdByName,
          updatedBy: createdBy,
        };
        updateEspAccountDetails(data);
        setButtonDisabled(true);
      }
    },
  });
  const addEspAccountDetail = async (data) => {
    try {
      setButtonDisabled(true);
      const res = await axiosInstance.post(`${apiEndPoints.addCap}`, data);
      console.log(res, "res");
      getDataRender();
      enqueueSnackbar(`${res.data.message}`, {
        variant: "success",
      });
    } catch (error) {
      setButtonDisabled(false);
      enqueueSnackbar(`${error.response.data.message}`, {
        variant: "error",
      });
    }
  };
  const updateEspAccountDetails = async (data) => {
    try {
      const res = await axiosInstance.post(
        `${apiEndPoints.updateCapById}/${defaultValues?.data?._id}`,
        data
      );
      getDataRender();
      enqueueSnackbar(`${res.data.message}`, {
        variant: "success",
      });
    } catch (error) {
      setButtonDisabled(false);
      enqueueSnackbar(`${error.response.data.message}`, {
        variant: "error",
      });
    }
  };
  useEffect(() => {
    setReceivedData(defaultValues);
    if (defaultValues && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);

  const setFieldValues = (values) => {
    console.log(values, "values");
    formik.setFieldValue("capName", values?.data?.capName);
    formik.setFieldValue("ispsName", values.data.ispsName);
    formik.setFieldValue("espsIntegrated", values?.data?.espsIntegrated);
    formik.setFieldValue("espsAccount", values?.data?.espsAccount);
    formik.setFieldValue("capNumber", values?.data?.capNumber);
  };
  return (
    <Drawer anchor="right" open={isDrawerOpen}>
      <Box
        sx={{ m: 1, width: "350px", margin: "24px" }}
        noValidate
        autoComplete="off"
      >
        <div>
          <form onSubmit={formik.handleSubmit}>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "1.3rem",
                mt: 4,
                mb: 3,
              }}
            >
              {defaultValueslength === 0
                ? "Add ESP / ISP Cap"
                : "Update ESP / ISP Cap"}
            </Typography>

            <div>
              <div
                style={{
                  width: "350px",
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  label="Name of Cap"
                  name="capName"
                  value={formik.values.capName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.capName && Boolean(formik.errors.capName)
                  }
                  helperText={formik.touched.capName && formik.errors.capName}
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id="ispsName"
                  name="ispsName"
                  options={isps}
                  value={formik.values.ispsName || null}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("ispsName", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ISPs"
                      variant="standard"
                      error={
                        formik.touched.ispsName &&
                        Boolean(formik.errors.ispsName)
                      }
                      helperText={
                        formik.touched.ispsName && formik.errors.ispsName
                      }
                    />
                  )}
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" espsIntegrated"
                  name=" espsIntegrated"
                  options={EspList}
                  value={formik.values.espsIntegrated || null}
                  getOptionLabel={(option) => option.esp_name}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("espsIntegrated", newValue);
                    formik.setFieldValue("espsAccount", null);
                    getEspAccount(newValue?.esp_id);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ESPs integrated"
                      variant="standard"
                      error={
                        formik.touched.espsIntegrated &&
                        Boolean(formik.errors.espsIntegrated)
                      }
                      helperText={
                        formik.touched.espsIntegrated &&
                        formik.errors.espsIntegrated
                      }
                    />
                  )}
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" espsAccount"
                  name=" espsAccount"
                  options={data}
                  value={formik.values.espsAccount || null}
                  getOptionLabel={(option) => option.account_name}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("espsAccount", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" ESPs Account"
                      variant="standard"
                      error={
                        formik.touched.espsAccount &&
                        Boolean(formik.errors.espsAccount)
                      }
                      helperText={
                        formik.touched.espsAccount && formik.errors.espsAccount
                      }
                    />
                  )}
                />
              </div>
              <div
                style={{
                  width: "350px",
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  label="Number of CAP"
                  name="capNumber"
                  value={formik.values.capNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.capNumber && Boolean(formik.errors.capNumber)
                  }
                  helperText={
                    formik.touched.capNumber && formik.errors.capNumber
                  }
                />
              </div>
            </div>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
              }}
            >
              <Button
                onClick={() => {
                  setIsDrawerOpen(false);
                  // setFieldValues(defaultValues);
                  formik.resetForm();
                  setDefaultValues({});
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // setDefaultValues({});
                }}
                disabled={isButtonDisabled}
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </form>
        </div>
      </Box>
    </Drawer>
  );
};

export default EspDrawer;
