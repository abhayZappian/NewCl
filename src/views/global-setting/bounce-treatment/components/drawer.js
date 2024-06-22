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
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { enqueueSnackbar } from "notistack";

const validationSchema = Yup.object().shape({
  bounceType: Yup.mixed().required("Bounce Type is required"),
  bounceIdentifier: Yup.mixed().required("Selection of Account is required"),
  bounceBehaviour: Yup.mixed().required("Bounce behaviour is required"),
});

const BounceTreatmentDrawer = ({
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
  console.log(receivedData, "receivedData");
  const [bounceBehaviour, setBounceBehaviour] = useState([]);
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
  const getBounceBehaviour = async () => {
    const { data } = await axiosInstance.get(
      apiEndPoints.bounceBehaviourDropDown
    );
    setBounceBehaviour(data.result);
  };

  useEffect(() => {
    getESP();
    getBounceBehaviour();
  }, []);

  const formik = useFormik({
    initialValues: {
      bounceType: null,
      bounceIdentifier: null,
      bounceBehaviour: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      if (defaultValueslength === 0) {
        const data = {
          bounceType: values.bounceType,
          bounceIdentifier: values.bounceIdentifier,
          bouncebehaviour: values.bounceBehaviour,
          createdBy: createdBy,
          createdByName: createdByName,
        };
        createBounceTreatment(data);
      } else {
        const data = {
          bounceType: values.bounceType,
          bounceIdentifier: values.bounceIdentifier,
          bouncebehaviour: values.bounceBehaviour,
          createdBy: createdBy,
          createdByName: createdByName,
        };
        updateBounceTreatment(data);
        setButtonDisabled(true);
      }
    },
  });

  const createBounceTreatment = async (data) => {
    try {
      setButtonDisabled(true);
      const res = await axiosInstance.post(apiEndPoints.createBounce, data);
      console.log(res, "ssss");
      enqueueSnackbar(`${res?.data?.message}`, {
        variant: "success",
      });
      getDataRender();
    } catch (error) {
      setButtonDisabled(false);
      enqueueSnackbar(`${error.response?.data?.message}`, {
        variant: "error",
      });
    }
  };

  const updateBounceTreatment = async (data) => {
    try {
      // debugger
      setButtonDisabled(true);
      const res = await axiosInstance.put(
        `${apiEndPoints.updateBounceById}/${receivedData.data._id}`,
        data
      );
      enqueueSnackbar(`${res?.data?.message}`, {
        variant: "success",
      });
      getDataRender();
    } catch (error) {
      enqueueSnackbar(`${error.response?.data?.message}`, {
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
    console.log(values.data, "valuesss");
    formik.setFieldValue("bounceType", values?.data?.bounceType);
    formik.setFieldValue("bounceIdentifier", values?.data?.bounceIdentifier);
    formik.setFieldValue("bounceBehaviour", values?.data?.bounceBehaviour);
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
                mb: 3,
                mt: 4,
              }}
            >
              {defaultValueslength === 0
                ? "Add Bounce Treatment Account"
                : "Update Bounce Treatment"}
            </Typography>

            <div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" bounceType"
                  name=" bounceType"
                  options={EspList}
                  value={formik.values.bounceType || null}
                  getOptionLabel={(option) => option.esp_name}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("bounceType", newValue);
                    formik.setFieldValue("bounceIdentifier", null);
                    getEspAccount(newValue?.esp_id);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select type ESP / Server / Domain"
                      variant="standard"
                      error={
                        formik.touched.bounceType &&
                        Boolean(formik.errors.bounceType)
                      }
                      helperText={
                        formik.touched.bounceType && formik.errors.bounceType
                      }
                    />
                  )}
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" bounceIdentifier"
                  name=" bounceIdentifier"
                  options={data}
                  value={formik.values.bounceIdentifier || null}
                  getOptionLabel={(option) => option.account_name}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("bounceIdentifier", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Selection of Account / IP / Domain Name"
                      variant="standard"
                      error={
                        formik.touched.bounceIdentifier &&
                        Boolean(formik.errors.bounceIdentifier)
                      }
                      helperText={
                        formik.touched.bounceIdentifier &&
                        formik.errors.bounceIdentifier
                      }
                    />
                  )}
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id="bounceBehaviour"
                  name="bounceBehaviour"
                  options={bounceBehaviour}
                  value={formik.values.bounceBehaviour || null}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("bounceBehaviour", newValue);
                    console.log(newValue, "newvaluess");
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bounce behavior"
                      variant="standard"
                      error={
                        formik.touched.bounceBehaviour &&
                        Boolean(formik.errors.bounceBehaviour)
                      }
                      helperText={
                        formik.touched.bounceBehaviour &&
                        formik.errors.bounceBehaviour
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

export default BounceTreatmentDrawer;
