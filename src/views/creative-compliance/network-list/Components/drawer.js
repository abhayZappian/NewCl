import { Box, Button, Drawer, TextField } from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useState } from "react";
import { Typography } from "@mui/joy";
import { createdByName, createdBy } from "../../../../helpers/userInfo";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { enqueueSnackbar } from "notistack";
const validationSchema = Yup.object().shape({
  networkName: Yup.string()
    .trim()
    .required("Network Name required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
});

const NetworkListDrawer = ({ defaultValues, open, setOpen, getDataRender }) => {
  const defaultValueslength = Object.keys(defaultValues).length;
  const [receivedData, setReceivedData] = useState({});
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  console.log(defaultValues, "defaultValues");

  useEffect(() => {
    setReceivedData(defaultValues);
    if (defaultValues !== undefined && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);

  const setFieldValues = (values) => {
    formik.setFieldValue(
      "networkName",
      defaultValues?.networkName ? defaultValues?.networkName : ""
    );
    formik.setFieldValue(
      "description",
      defaultValues?.description ? defaultValues?.description : ""
    );
    setTimeout(() => {
      formik.validateField("networkName");
      formik.validateField("description");
    }, 0);
  };

  const addNetworkData = async (data) => {
    try {
      const res = await axiosInstance.post(apiEndPoints.addNetwork, data);
      if (res) {
        setOpen({ drawer: false });
        getDataRender();
        enqueueSnackbar(`${res?.data?.message}`, {
          variant: "success",
        });
      }
      setButtonDisabled(false);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`${error?.response?.data?.message}`, {
        variant: "error",
      });
      setButtonDisabled(false);
    }
  };

  const updateNetworkData = async (data) => {
    try {
      const res = await axiosInstance.put(
        `${apiEndPoints.updateNetwork}/${defaultValues?._id}`,
        data
      );

      if (res) {
        setOpen({ drawer: false });
        enqueueSnackbar(`${res?.data?.message}`, {
          variant: "success",
        });
      }
      setTimeout(() => {
        getDataRender();
      }, 300);
      setButtonDisabled(false);
    } catch (error) {
      enqueueSnackbar(`${error?.response?.data?.message}`, {
        variant: "error",
      });
      setButtonDisabled(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      networkName: "",
      description: "",
    },

    validationSchema,
    onSubmit: (values) => {
      const data = {
        networkName: values.networkName.trim(),
        description: values.description.trim(),
        created_by: createdBy,
        creator_name: createdByName,
      };

      if (defaultValueslength === 0) {
        addNetworkData(data);
        setButtonDisabled(true);
      } else {
        updateNetworkData(data);
        setButtonDisabled(true);
      }
    },
  });
  return (
    <>
      <Drawer anchor="right" open={open}>
        <Box
          sx={{ m: 1, width: "350px", margin: "24px" }}
          noValidate
          autoComplete="off"
        >
          <div></div>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "1.3rem",
                  mt: 4,
                  mb: 2,
                }}
              >
                Add Network List
              </Typography>
              <Box>
                <div style={{ width: "330px" }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Network Name"
                    name="networkName"
                    value={formik.values.networkName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.networkName &&
                      Boolean(formik.errors.networkName)
                    }
                    helperText={
                      formik.touched.networkName && formik.errors.networkName
                    }
                  />
                </div>

                <div style={{ width: "330px" }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Discription "
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpen({ drawer: false });
                    setFieldValues(defaultValues);
                  }}
                >
                  Cancel
                </Button>
                <Button
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
    </>
  );
};

export default NetworkListDrawer;
