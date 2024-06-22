import {
  Autocomplete,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as Yup from "yup";
import { addIp, updateIp } from "services/IP";
import { enqueueSnackbar } from "notistack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createdBy, createdByName } from "helpers/userInfo";

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

const validationSchemaSingle = Yup.object().shape({
  ip_add_single: Yup.array()
    .of(Yup.string())
    .min(1, "IP Address required")
    .required("IP Address required"),
  organization_name_single: Yup.string().required("Organization Name required"),
  purchased_date_single: Yup.mixed().required("Purchased Date required"),
  portal_name_single: Yup.string().required("Portal Name required"),
  user_name_single: Yup.string().required("User Name required"),
  expiry_date_single: Yup.mixed().required("Expiry Date required"),
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
  organization_name: Yup.string().required("Organization Name required"),
  purchased_date: Yup.mixed().required("Purchased Date required"),
  portal_name: Yup.string().required("Portal Name required"),
  user_name: Yup.string().required("User Name required"),
  expiry_date: Yup.mixed().required("Expiry Date required"),
  /* csvFile: Yup.mixed()
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

const IpDrawer = ({
  open,
  setOpen,
  getRenderData,
  defaultValues,
  setDefaultValues,
}) => {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [disableButton, setdisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("single");
  //const [editMode, setEditMode] = useState("forthis");

  /* const handleEditModeChange = (event) => {
    setEditMode(event.target.value);
  }; */
  const defaultValueslength = Object.keys(defaultValues).length;

  const addIpDetails = async (data) => {
    try {
      setIsLoading(true);
      await addIp(data);
      setOpen(false);
      formik.handleReset();
      getRenderData();
    } catch (error) {
      console.log(error, "error");
    } finally {
      setIsLoading(false);
    }
  };
  /*  const updateIpDetails = async (data, id, refID) => {
    try {
      setIsLoading(true);
      await updateIp(data, id, refID);
      console.log(data, id, refID, "update");
      setOpen(false);
      formik.handleReset();
      await getRenderData();
    } catch (error) {
      console.log(error, "error");
    } finally {
      setIsLoading(false);
    }
  }; */

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

          //editMode: editMode === "forthis" ? "forthis" : "forall",
        };
        console.log("Single IP Data:", data);
        if (defaultValueslength === 0) {
          addIpDetails(data);
        } /* else {
          console.log("Updating with ID:", defaultValues);
          updateIpDetails(data, defaultValues._id, defaultValues.refID);
        } */
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
          range: values.range,
          ip_add: values.ip_add,
          organization_name: values.organization_name,
          portal_name: values.portal_name,
          user_name: values.user_name,
          purchased_date: values.purchased_date,
          expiry_date: values.expiry_date,
          csvFile: values.csvFile,
          refID: defaultValues.refID,
          //editMode: editMode === "forthis" ? "forthis" : "forall",
        };
        if (defaultValueslength === 0) {
          addIpDetails(data);
        } /* else {
          updateIpDetails(data, defaultValues._id, defaultValues.refID);
        } */
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
      <Drawer anchor="right" open={open}>
        {/* {defaultValueslength !== 0 ? (
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
                      disabled // Add disabled property to disable editing
                      slotProps={{
                        textField: {
                          error:
                            formikSingle.touched.purchased_date_single &&
                            Boolean(formikSingle.errors.purchased_date_single),
                          helperText:
                            formikSingle.touched.purchased_date_single &&
                            formikSingle.errors.purchased_date_single,
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
                    setOpen(false);
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
        ) : ( */}
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{ m: 1, width: "350px", margin: "24px" }}
            noValidate
            autoComplete="off"
          >
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "1.3rem",
                mt: 0,
                mb: 3,
              }}
            >
              {defaultValueslength === 0
                ? " Add IP Historical Data"
                : "Update  IP Historical Data"}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  // name="row-radio-buttons-group"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    onChange={() => setType("single")}
                    value="single"
                    control={<Radio />}
                    label="Single"
                  />
                  <FormControlLabel
                    onChange={() => setType("multiple")}
                    value="multiple"
                    control={<Radio />}
                    label="Multiple"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            {formik.values.type === "single" ? (
              <>
                <Box sx={{ mt: -3 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="ip_add_single"
                    label="IP Address"
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("ip_add_single", [value]);
                    }}
                    value={formik.values.ip_add_single}
                    error={
                      formik.touched.ip_add_single &&
                      Boolean(formik.errors.ip_add_single)
                    }
                    helperText={
                      formik.touched.ip_add_single &&
                      formik.errors.ip_add_single
                    }
                  />
                </Box>
                <Box sx={{ mt: 0 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="organization_name_single"
                    label="Organisation Name"
                    onChange={formik.handleChange}
                    value={formik.values.organization_name_single}
                    error={
                      formik.touched.organization_name_single &&
                      Boolean(formik.errors.organization_name_single)
                    }
                    helperText={
                      formik.touched.organization_name_single &&
                      formik.errors.organization_name_single
                    }
                  />
                </Box>
                <Box sx={{ mt: 0 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="portal_name_single"
                    label="Portal Name"
                    onChange={formik.handleChange}
                    value={formik.values.portal_name_single}
                    error={
                      formik.touched.portal_name_single &&
                      Boolean(formik.errors.portal_name_single)
                    }
                    helperText={
                      formik.touched.portal_name_single &&
                      formik.errors.portal_name_single
                    }
                  />
                </Box>
                <Box sx={{ mt: 0 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="user_name_single"
                    label="User Name"
                    onChange={formik.handleChange}
                    value={formik.values.user_name_single}
                    error={
                      formik.touched.user_name_single &&
                      Boolean(formik.errors.user_name_single)
                    }
                    helperText={
                      formik.touched.user_name_single &&
                      formik.errors.user_name_single
                    }
                  />
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack sx={{ minWidth: 305, marginTop: 2 }}>
                      <DemoContainer components={["purchased_date_single"]}>
                        <DatePicker
                          disableFuture
                          label="Purchased Date"
                          fullWidth
                          sx={{ width: "100%" }}
                          name="purchased_date_single"
                          value={
                            formik.values?.purchased_date_single
                              ? dayjs(formik.values?.purchased_date_single)
                              : formik.values?.purchased_date_single
                          }
                          onChange={(newValue) => {
                            const value = new Date(newValue.$d);
                            const currentTime = new Date();
                            value.setHours(currentTime.getHours());
                            value.setMinutes(currentTime.getMinutes());
                            value.setSeconds(currentTime.getSeconds());
                            formik.setFieldValue(
                              `purchased_date_single`,
                              value,
                              true
                            );
                          }}
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.purchased_date_single &&
                                Boolean(formik.errors.purchased_date_single),
                              helperText:
                                formik.touched.purchased_date_single &&
                                formik.errors.purchased_date_single,
                            },
                          }}
                        />
                      </DemoContainer>
                    </Stack>
                  </LocalizationProvider>
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack sx={{ minWidth: 305, marginTop: 2 }}>
                      <DemoContainer components={["expiry_date_single"]}>
                        <DatePicker
                          disablePast
                          label="Expiry Date"
                          fullWidth
                          sx={{ width: "100%" }}
                          name="expiry_date_single"
                          value={
                            formik.values?.expiry_date_single
                              ? dayjs(formik.values?.expiry_date_single)
                              : formik.values?.expiry_date_single
                          }
                          // value={formik.values.expiry_date_single}
                          onChange={(newValue) => {
                            const value = new Date(newValue.$d);
                            const currentTime = new Date();
                            value.setHours(currentTime.getHours());
                            value.setMinutes(currentTime.getMinutes());
                            value.setSeconds(currentTime.getSeconds());
                            formik.setFieldValue(
                              "expiry_date_single",
                              value,
                              true
                            );
                          }}
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.expiry_date_single &&
                                Boolean(formik.errors.expiry_date_single),
                              helperText:
                                formik.touched.expiry_date_single &&
                                formik.errors.expiry_date_single,
                            },
                          }}
                        />
                      </DemoContainer>
                    </Stack>
                  </LocalizationProvider>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Autocomplete
                    sx={{ mt: -3, mb: 4 }}
                    fullWidth
                    disablePortal
                    onChange={(e, newValue) => {
                      console.log(newValue);
                      formik.setFieldValue("range", newValue);
                    }}
                    value={formik.values.range}
                    id="combo-box-demo"
                    options={["31", "30", "29", "28", "27", "26", "25", "24"]}
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        label="IP Range"
                      />
                    )}
                  />
                </Box>
                <Box>
                  <TextField
                    disabled={defaultValueslength !== 0}
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    id="ip_add"
                    label="IP (Range format)"
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("ip_add", [value]);
                    }}
                    value={formik.values.ip_add}
                    error={
                      formik.touched.ip_add && Boolean(formik.errors.ip_add)
                    }
                    helperText={formik.touched.ip_add && formik.errors.ip_add}
                  />
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: defaultValueslength === 0 ? "block" : "none",
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
                        setSelectedFileName(
                          selectedFile ? selectedFile.name : ""
                        );
                      }
                    }}
                    error={
                      formik.touched.csvFile && Boolean(formik.errors.csvFile)
                    }
                    helperText={formik.touched.csvFile && formik.errors.csvFile}
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
                  {formik.touched.csvFile && formik.errors.csvFile && (
                    <div
                      style={{
                        color: "#f44336",
                        fontSize: "0.75rem",
                        lineHeight: "1.66",
                      }}
                    >
                      {formik.errors.csvFile}
                    </div>
                  )}
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
                </Box>

                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="organization_name"
                    label="Organization Name"
                    onChange={formik.handleChange}
                    value={formik.values.organization_name}
                    error={
                      formik.touched.organization_name &&
                      Boolean(formik.errors.organization_name)
                    }
                    helperText={
                      formik.touched.organization_name &&
                      formik.errors.organization_name
                    }
                  />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="portal_name"
                    label="Portal Name"
                    onChange={formik.handleChange}
                    value={formik.values.portal_name}
                    error={
                      formik.touched.portal_name &&
                      Boolean(formik.errors.portal_name)
                    }
                    helperText={
                      formik.touched.portal_name && formik.errors.portal_name
                    }
                  />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="user_name"
                    label="User Name "
                    onChange={formik.handleChange}
                    value={formik.values.user_name}
                    error={
                      formik.touched.user_name &&
                      Boolean(formik.errors.user_name)
                    }
                    helperText={
                      formik.touched.user_name && formik.errors.user_name
                    }
                  />
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack sx={{ minWidth: 305, marginTop: 2 }}>
                      <DemoContainer components={["purchased_date"]}>
                        <DatePicker
                          disableFuture
                          label="Purchased Date"
                          fullWidth
                          sx={{ width: "100%" }}
                          name="purchased_date"
                          value={
                            formik.values?.purchased_date
                              ? dayjs(formik.values?.purchased_date)
                              : formik.values?.purchased_date
                          }
                          onChange={(newValue) => {
                            const value = new Date(newValue.$d);
                            const currentTime = new Date();
                            value.setHours(currentTime.getHours());
                            value.setMinutes(currentTime.getMinutes());
                            value.setSeconds(currentTime.getSeconds());
                            formik.setFieldValue(`purchased_date`, value, true);
                          }}
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.purchased_date &&
                                Boolean(formik.errors.purchased_date),
                              helperText:
                                formik.touched.purchased_date &&
                                formik.errors.purchased_date,
                            },
                          }}
                        />
                      </DemoContainer>
                    </Stack>
                  </LocalizationProvider>
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack sx={{ minWidth: 305, marginTop: 2 }}>
                      <DemoContainer components={["expiry_date"]}>
                        <DatePicker
                          disablePast
                          label="Expiry Date"
                          fullWidth
                          sx={{ width: "100%" }}
                          name="expiry_date"
                          value={
                            formik.values?.expiry_date
                              ? dayjs(formik.values?.expiry_date)
                              : formik.values?.expiry_date
                          }
                          // value={formik.values.expiry_date}
                          onChange={(newValue) => {
                            const value = new Date(newValue.$d);
                            const currentTime = new Date();
                            value.setHours(currentTime.getHours());
                            value.setMinutes(currentTime.getMinutes());
                            value.setSeconds(currentTime.getSeconds());
                            formik.setFieldValue("expiry_date", value, true);
                          }}
                          slotProps={{
                            textField: {
                              error:
                                formik.touched.expiry_date &&
                                Boolean(formik.errors.expiry_date),
                              helperText:
                                formik.touched.expiry_date &&
                                formik.errors.expiry_date,
                            },
                          }}
                        />
                      </DemoContainer>
                    </Stack>
                  </LocalizationProvider>
                </Box>
              </>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 5,
              }}
            >
              <Button disabled={isLoading} variant="contained" type="submit">
                submit
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
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
        {/* )} */}
      </Drawer>
    </Box>
  );
};

export default IpDrawer;
