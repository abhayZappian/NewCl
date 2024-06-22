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
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";

const validationSchema = Yup.object().shape({
  esps: Yup.mixed().required("ESP is required"),
  espaccountname: Yup.mixed().required("ESP Account name is required"),
  espvolume: Yup.string()
    .matches(/^[0-9]+$/, {
      message: "Numbers are allowed without space",
      excludeEmptyString: true,
    })
    .required("ESP Volume is required"),
  periodValue: Yup.mixed().required("Per Day value is required"),
});

const EspDrawer = ({
  defaultValues,
  setDefaultValues,
  isDrawerOpen,
  setIsDrawerOpen,
  getDataRender,
}) => {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [EspList, setEspList] = useState([]);
  const [data, setData] = useState([]);
  const [receivedData, setReceivedData] = useState({});
  const [periodValue, setPeriodValue] = useState([]);
  const defaultValueslength = Object.keys(defaultValues).length;

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
  const periodValuesDropDown = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.periodValuesDropDown);
    setPeriodValue(data.results);
  };

  useEffect(() => {
    getESP();
    periodValuesDropDown();
  }, []);

  const formik = useFormik({
    initialValues: {
      esps: null,
      espaccountname: null,
      espvolume: "",
      periodValue: null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (defaultValueslength === 0) {
        const data = {
          esps: values.esps,
          espaccountname: values.espaccountname,
          espvolume: Number(values.espvolume),
          periodValue: values.periodValue,
          createdByName: createdByName,
          createdBy: createdBy,
        };
        addEspCommitmentDetail(data);
      } else {
        const data = {
          esps: values.esps,
          espaccountname: values.espaccountname,
          espvolume: Number(values.espvolume),
          periodValue: values.periodValue,
          updatedByName: createdByName,
          updatedBy: createdBy,
        };
        updateEspCommitmentDetails(data);
        setButtonDisabled(true);
      }
    },
  });
  const addEspCommitmentDetail = async (data) => {
    try {
      setButtonDisabled(true);
      const res = await axiosInstance.post(
        apiEndPoints.saveEspCommitment,
        data
      );
      enqueueSnackbar(`${res.data.message}`, {
        variant: "success",
      });
      getDataRender();
    } catch (error) {
      enqueueSnackbar(`${error.response.data.message}`, {
        variant: "error",
      });
      setButtonDisabled(false);
    }
  };
  const updateEspCommitmentDetails = async (data) => {
    try {
      // debugger
      setButtonDisabled(true);
      const res = await axiosInstance.put(
        `${apiEndPoints.updateEspCommitment}/${defaultValues?.data?._id}`,
        data
      );
      enqueueSnackbar(`${res.data.message}`, {
        variant: "success",
      });
      getDataRender();
    } catch (error) {
      enqueueSnackbar(`${error.response.data.message}`, {
        variant: "error",
      });
      setButtonDisabled(false);
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
    formik.setFieldValue("esps", values?.data?.esps);
    formik.setFieldValue("espaccountname", values?.data?.espAccountName);
    formik.setFieldValue("espvolume", values?.data?.espVolume);
    formik.setFieldValue("periodValue", values?.data?.periodValues);
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
                ? "Add ESP Commitment"
                : "Update ESP Commitment"}
            </Typography>

            <div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" esps"
                  name=" esps"
                  options={EspList}
                  value={formik.values.esps || null}
                  getOptionLabel={(option) => option.esp_name}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("esps", newValue);
                    formik.setFieldValue("espaccountname", null);
                    getEspAccount(newValue?.esp_id);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ESP"
                      variant="standard"
                      error={formik.touched.esps && Boolean(formik.errors.esps)}
                      helperText={formik.touched.esps && formik.errors.esps}
                    />
                  )}
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" espaccountname"
                  name=" espaccountname"
                  options={data}
                  value={formik.values.espaccountname || null}
                  getOptionLabel={(option) => option.account_name}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("espaccountname", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ESP Account"
                      variant="standard"
                      error={
                        formik.touched.espaccountname &&
                        Boolean(formik.errors.espaccountname)
                      }
                      helperText={
                        formik.touched.espaccountname &&
                        formik.errors.espaccountname
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
                  label="ESP Number"
                  name="espvolume"
                  value={formik.values.espvolume}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.espvolume && Boolean(formik.errors.espvolume)
                  }
                  helperText={
                    formik.touched.espvolume && formik.errors.espvolume
                  }
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" periodValue"
                  name=" periodValue"
                  options={periodValue}
                  value={formik.values.periodValue || null}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("periodValue", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Per Day"
                      variant="standard"
                      error={
                        formik.touched.periodValue &&
                        Boolean(formik.errors.periodValue)
                      }
                      helperText={
                        formik.touched.periodValue && formik.errors.periodValue
                      }
                    />
                  )}
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
