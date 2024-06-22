import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Stack from "@mui/material/Stack";

import { useFormik } from "formik";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import * as Yup from "yup";
import { updateIp } from "services/IP";

const validationSchemaSingle = Yup.object().shape({
  //ip_add_single: Yup.string().required("IP Address required"),
  /* organization_name_single: Yup.string().required("Organization Name required"),
  purchased_date_single: Yup.mixed().required("Purchased Date required"),
  portal_name_single: Yup.string().required("Portal Name required"),
  user_name_single: Yup.string().required("User Name required"),
  expiry_date_single: Yup.mixed().required("Expiry Date required"), */
});
const validationSchema = Yup.object().shape({
  /* ip_add: Yup.string().test({
      name: "ipRequired",
      test: function (value) {
        const csvFile = this.parent.csvFile;
        if (!csvFile) {
          return (
            !!value || this.createError({ message: "IP Address is required" })
          );
        } else {
          return true;
        }
      },
    }), */
  /*  organization_name: Yup.string().required("Organization Name required"),
  purchased_date: Yup.mixed().required("Purchased Date required"),
  portal_name: Yup.string().required("Portal Name required"),
  user_name: Yup.string().required("User Name required"),
  expiry_date: Yup.mixed().required("Expiry Date required"),
  csvFile: Yup.mixed()
    .test(
      "fileFormat",
      "Invalid file format, please upload a CSV file",
      (value) => {
        if (!value) return true;
        return value && value.type === "text/csv";
      }
    )
    .when("ip_add", {
      is: "",
      then: Yup.mixed().required("CSV File is required"),
      otherwise: Yup.mixed(),
    }), */
});

const EditDrawer = ({
  openEdit,
  setOpenEdit,
  getRenderData,
  defaultValues,
  setDefaultValues,
}) => {
  const [disableButton, setdisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("single");
  const [editMode, setEditMode] = useState("forthis");

  const handleEditModeChange = (event) => {
    setEditMode(event.target.value);
  };
  const defaultValueslength = Object.keys(defaultValues).length;

  const updateIpDetails = async (data, id, refID) => {
    try {
      setIsLoading(true);
      await updateIp(data, id, refID);
      console.log(data, id, refID, "update");
      setOpenEdit(false);
      formik.handleReset();
      await getRenderData();
    } catch (error) {
      console.log(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formikSingle = useFormik({
    initialValues: {
      type: "single",
      ip_add_single: [],
      organization_name_single: "",
      portal_name_single: "",
      user_name_single: "",
      purchased_date_single: null,
      expiry_date_single: null,
    },
    validationSchema: validationSchemaSingle,
    onSubmit: (values) => {
      if (type === "single") {
        const data = {
          type: values.type,
          range: "32",
          ip_add: values.ip_add_single,
          organization_name: values.organization_name_single,
          portal_name: values.portal_name_single,
          user_name: values.user_name_single,
          purchased_date: values.purchased_date_single,
          expiry_date: values.expiry_date_single,
          refID: defaultValues.refID,

          editMode: editMode === "forthis" ? "forthis" : "forall",
        };
        console.log("Single IP Data:", data);
        if (defaultValueslength === 0) {
          //addIpDetails(data);
        } else {
          console.log("Updating with ID:", defaultValues);
          updateIpDetails(data, defaultValues._id, defaultValues.refID);
        }
      }
    },
  });

  const formikMultiple = useFormik({
    initialValues: {
      type: "multiple",
      ip_add: [""],
      range: "",
      organization_name: "",
      purchased_date: null,
      portal_name: "",
      user_name: "",
      expiry_date: null,
      csvFile: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (type === "multiple") {
        const data = {
          type: values.type,
          range: "32",
          ip_add: values.ip_add,
          organization_name: values.organization_name,
          portal_name: values.portal_name,
          user_name: values.user_name,
          purchased_date: values.purchased_date,
          expiry_date: values.expiry_date,
          csvFile: values.csvFile,
          refID: defaultValues.refID,
          editMode: editMode === "forthis" ? "forthis" : "forall",
        };
        if (defaultValueslength === 0) {
          //addIpDetails(data);
        } else {
          updateIpDetails(data, defaultValues._id, defaultValues.refID);
        }
      }
    },
  });

  const formik = type === "single" ? formikSingle : formikMultiple;

  const disableHandler = () => {
    setdisableButton(true);
    setTimeout(() => {
      setdisableButton(false);
    }, 100);
  };

  const setFieldValues = (values) => {
    if (type === "single") {
      formikSingle.setFieldValue("ip_add_single", values?.ip_add);
      formikSingle.setFieldValue(
        "organization_name_single",
        values?.organization_name
      );
      formikSingle.setFieldValue(
        "purchased_date_single",
        values?.purchased_date
      );
      formikSingle.setFieldValue("portal_name_single", values?.portal_name);
      formikSingle.setFieldValue("user_name_single", values?.user_name);
      formikSingle.setFieldValue("expiry_date_single", values?.expiry_date);
    } else {
      formikMultiple.setFieldValue("ip_add", values?.ip_add);
      formikMultiple.setFieldValue(
        "organization_name",
        values?.organization_name
      );
      formikMultiple.setFieldValue("purchased_date", values?.purchased_date);
      formikMultiple.setFieldValue("portal_name", values?.portal_name);
      formikMultiple.setFieldValue("user_name", values?.user_name);
      formikMultiple.setFieldValue("expiry_date", values?.expiry_date);
    }
  };

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);

  return (
    <Box>
      <Drawer anchor="right" open={openEdit}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ m: 1, width: "350px", margin: "24px" }}>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "1.3rem",
                mt: 0,
                mb: 3,
              }}
            >
              Update IP Historical Data
            </Typography>

            <Box sx={{ mt: 0 }}>
              <TextField
                fullWidth
                variant="standard"
                id="ip_add_single"
                label="IP Address"
                value={formik.values.ip_add_single}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                variant="standard"
                id="organization_name_single"
                label="Organisation Name"
                value={formik.values.organization_name_single}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                variant="standard"
                id="portal_name_single"
                label="Portal Name"
                value={formik.values.portal_name_single}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                variant="standard"
                id="user_name_single"
                label="User Name"
                value={formik.values.user_name_single}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ minWidth: 305, marginTop: 2 }}>
                  <DatePicker
                    disablePast
                    label="Purchased Date"
                    fullWidth
                    sx={{ width: "100%" }}
                    name="purchased_date_single"
                    value={
                      formikSingle.values?.purchased_date_single
                        ? dayjs(formikSingle.values?.purchased_date_single)
                        : null
                    }
                    onChange={(newValue) => {
                      const value = new Date(newValue.$d);
                      const currentTime = new Date();
                      value.setHours(currentTime.getHours());
                      value.setMinutes(currentTime.getMinutes());
                      value.setSeconds(currentTime.getSeconds());
                      formikSingle.setFieldValue(
                        "purchased_date_single",
                        value,
                        true
                      );
                    }}
                    readOnly
                    slotProps={{
                      textField: {
                        error:
                          formikSingle.touched.purchased_date_single &&
                          Boolean(formikSingle.errors.purchased_date_single),
                        helperText:
                          formikSingle.touched.purchased_date_single &&
                          formikSingle.errors.purchased_date_single,
                        InputProps: {
                          sx: {
                            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                              borderColor: "inherit",
                            },
                          },
                        },
                        InputLabelProps: {
                          sx: {
                            "&.Mui-error": {
                              color: "inherit",
                            },
                          },
                        },
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>
            <Box sx={{ mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ minWidth: 305, marginTop: 2 }}>
                  <DatePicker
                    disablePast
                    label="Expiry Date"
                    fullWidth
                    sx={{ width: "100%" }}
                    name="expiry_date_single"
                    value={
                      formikSingle.values?.expiry_date_single
                        ? dayjs(formikSingle.values?.expiry_date_single)
                        : null
                    }
                    onChange={(newValue) => {
                      const value = new Date(newValue.$d);
                      const currentTime = new Date();
                      value.setHours(currentTime.getHours());
                      value.setMinutes(currentTime.getMinutes());
                      value.setSeconds(currentTime.getSeconds());
                      formikSingle.setFieldValue(
                        "expiry_date_single",
                        value,
                        true
                      );
                    }}
                    slotProps={{
                      textField: {
                        error:
                          formikSingle.touched.expiry_date_single &&
                          Boolean(formikSingle.errors.expiry_date_single),
                        helperText:
                          formikSingle.touched.expiry_date_single &&
                          formikSingle.errors.expiry_date_single,
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>
            <Box sx={{ mt: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Edit Mode</FormLabel>
                <RadioGroup
                  row
                  aria-label="editMode"
                  name="editMode"
                  value={editMode}
                  onChange={handleEditModeChange}
                >
                  <FormControlLabel
                    value="forthis"
                    control={<Radio />}
                    label="For This"
                  />
                  <FormControlLabel
                    value="forall"
                    control={<Radio />}
                    label="For All"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 5,
              }}
            >
              <Button disabled={isLoading} variant="contained" type="submit">
                Submit
              </Button>
              <Button
                onClick={() => {
                  setOpenEdit(false);
                  formik.resetForm();
                  setDefaultValues({});
                }}
                variant="outlined"
              >
                Close
              </Button>
            </Box>
          </Box>
        </form>
      </Drawer>
    </Box>
  );
};

export default EditDrawer;
