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
import { addEspAccount, editEspAccount } from "services/adminConsole/esp";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { enqueueSnackbar } from "notistack";

const validationSchema = Yup.object().shape({
  espId: Yup.mixed().required("ESP is required"),
  accountName: Yup.string().trim().required("Account name is required"),
});

const EspDrawer = ({
  defaultValues,
  setDefaultValues,
  isDrawerOpen,
  setIsDrawerOpen,
  getDataRender,
}) => {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [receivedData, setReceivedData] = useState({});
  const [disasteType, setDisasteType] = useState([]);
  const [actionType, setactionType] = useState([]);
  const defaultValueslength = Object.keys(defaultValues).length;

  const getDisasterType = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.disasterdropdown);
    setDisasteType(data.result);
  };
  const getActionType = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.actiontype);
    setactionType(data.data);
  };

  useEffect(() => {
    getDisasterType();
    getActionType();
  }, []);

  const formik = useFormik({
    initialValues: {
      disaster: null,
      actiontype: null,
    },
    // validationSchema,
    onSubmit: (values) => {
      const data = {
        disaster: values.disaster,
        actiontype: values.actionType,
        updatedBy: createdBy,
        updatedByName: createdByName,
      };
      addDisasterAction(data);
    },
  });
  const addDisasterAction = async (data) => {
    try {
      setButtonDisabled(true);
      const res = await axiosInstance.put(
        `${apiEndPoints.updatedisasterbyid}/${defaultValues.data._id}`,
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
    console.log(values.data, "aaaaaa");
    formik.setFieldValue("disaster", values?.data?.disaster);
    formik.setFieldValue("actionType", values?.data?.actionType);
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
                ? "Add Disaster & Actions"
                : "Update Disaster & Account"}
            </Typography>

            <div
              style={{
                width: "350px",
              }}
            >
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" disaster"
                  name=" disaster"
                  options={disasteType}
                  value={formik.values.disaster || null}
                  getOptionLabel={(option) => option.disaster}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("disaster", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Disaster Types"
                      variant="standard"
                      error={
                        formik.touched.disaster &&
                        Boolean(formik.errors.disaster)
                      }
                      helperText={
                        formik.touched.disaster && formik.errors.disaster
                      }
                    />
                  )}
                />
              </div>
              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id=" actionType"
                  name=" actionType"
                  options={actionType}
                  value={formik.values.actionType || null}
                  getOptionLabel={(option) => option.actionValue}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("actionType", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Action Type"
                      variant="standard"
                      error={
                        formik.touched.actionType &&
                        Boolean(formik.errors.actionType)
                      }
                      helperText={
                        formik.touched.actionType && formik.errors.actionType
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
