import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createdBy, createdByName } from "../../../../helpers/userInfo";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { enqueueSnackbar } from "notistack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

const validationSchema = Yup.object().shape({
  account_name: Yup.string()
    .trim()
    .required("Account Name required")
    .matches(
      /^[^\s]+(\s[^\s]+)*$/,
      "Only one space is allowed between words in the network name"
    ),
  domain_name: Yup.string()
    .trim()
    .required("Domain Name required")
    .matches(
      /^[^\s]+(\s[^\s]+)*$/,
      "Only one space is allowed between words in the network name"
    ),
  price: Yup.string().required("Price Required"),
  purchased_date: Yup.string().required("Purchased Date Required"),
  expiry_date: Yup.string().required("Expiry Date Required"),
  renewal_date: Yup.string().required("Renewal Date Required"),
});

const AddDomainDrawer = ({
  defaultValues,
  getDomainData,
  setDefaultValues,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  console.log(defaultValues, "defaultValues");

  const formik = useFormik({
    initialValues: {
      account_name: defaultValues?.account_name || "",
      domain_name: defaultValues?.domain_name || "",
      price: defaultValues?.price || "",
      purchased_date: defaultValues?.purchased_date || "",
      expiry_date: defaultValues?.expiry_date || "",
      renewal_date: defaultValues?.renewal_date || "",
    },
    validationSchema,
    onSubmit: (values) => {
      const data = {
        account_id: defaultValues?.account_id,
        domain_name: values?.domain_name.trim(),
        price: values.price,
        purchased_date: moment(values.purchased_date).format(
          "YYYY-MM-DDTHH:mm"
        ),
        expiry_date: moment(values.expiry_date).format("YYYY-MM-DDTHH:mm"),
        renewal_date: moment(values.renewal_date).format("YYYY-MM-DDTHH:mm"),
      };
      if (defaultValues?.domain_name) {
        data.modified_by = createdBy;
        data.modified_by_name = createdByName;
        updateDomainDetails(data);
      } else {
        data.created_by = createdBy;
        data.created_by_name = createdByName;
        addDomainDetails(data);
      }
    },
  });
  const addDomainDetails = async (data) => {
    try {
      const res = await axiosInstance.post(
        `${apiEndPoints.addDomainDetails}`,
        data
      );
      console.log(res);
      // getDataRender();
      setIsDrawerOpen(false);
      setTimeout(() => {
        formik.resetForm();
      }, 1000);
      enqueueSnackbar(`${res?.data?.message}`, {
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`${error?.response?.data?.message}`, {
        variant: "error",
      });
    }
  };
  const updateDomainDetails = async (data) => {
    try {
      const res = await axiosInstance.put(
        `${apiEndPoints.updateDomainDetails}/${defaultValues?.domain_id}`,
        data
      );
      await getDomainData(defaultValues?.account_id);
      setIsDrawerOpen(false);
      setTimeout(() => {
        formik.resetForm();
      }, 1000);
      enqueueSnackbar(`${res?.data?.message}`, {
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`${error?.response?.data?.message}`, {
        variant: "error",
      });
    }
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
                mt: 2,
              }}
            >
              {defaultValues.domain_id
                ? "Update Email Domain"
                : "Add Email Domain"}
            </Typography>
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="standard"
              id="account_name"
              name="account_name"
              label=" Account Name"
              value={formik.values.account_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ readOnly: true }}
              error={
                formik.touched.account_name &&
                Boolean(formik.errors.account_name)
              }
              helperText={
                formik.touched.account_name && formik.errors.account_name
              }
            />
            <TextField
              fullWidth
              variant="standard"
              id="domain_name"
              name="domain_name"
              label="Domain Name"
              value={formik.values.domain_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.domain_name && Boolean(formik.errors.domain_name)
              }
              helperText={
                formik.touched.domain_name && formik.errors.domain_name
              }
            />
            <TextField
              fullWidth
              variant="standard"
              id="price"
              name="price"
              label="Price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={0} sx={{ minWidth: 305, marginTop: 3 }}>
                <InputLabel htmlFor="purchased_date">Purchased Date</InputLabel>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    fullWidth
                    sx={{ width: "100%" }}
                    name="purchased_date"
                    value={dayjs(formik.values?.purchased_date)}
                    onChange={(newValue) =>
                      formik.setFieldValue("purchased_date", newValue.$d, true)
                    }
                    slotProps={{
                      textField: {
                        helperText: Boolean(formik.errors.purchased_date)
                          ? formik.errors.purchased_date
                          : "",
                      },
                    }}
                  />
                </DemoContainer>
              </Stack>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={0} sx={{ minWidth: 305, marginTop: 3 }}>
                <InputLabel htmlFor="renewal_date">Renewal Date</InputLabel>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    fullWidth
                    sx={{ width: "100%" }}
                    name="renewal_date"
                    value={dayjs(formik.values?.renewal_date)}
                    onChange={(newValue) =>
                      formik.setFieldValue("renewal_date", newValue.$d, true)
                    }
                    slotProps={{
                      textField: {
                        helperText: Boolean(formik.errors.renewal_date)
                          ? formik.errors.renewal_date
                          : "",
                      },
                    }}
                  />
                </DemoContainer>
              </Stack>
            </LocalizationProvider>{" "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={0} sx={{ minWidth: 305, marginTop: 3 }}>
                <InputLabel htmlFor="expiry_date">Expiry Date</InputLabel>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    fullWidth
                    sx={{ width: "100%" }}
                    name="expiry_date"
                    value={dayjs(formik.values?.expiry_date)}
                    onChange={(newValue) =>
                      formik.setFieldValue("expiry_date", newValue.$d, true)
                    }
                    slotProps={{
                      textField: {
                        helperText: Boolean(formik.errors.expiry_date)
                          ? formik.errors.expiry_date
                          : "",
                      },
                    }}
                    id="expiry_date"
                  />
                </DemoContainer>
              </Stack>
            </LocalizationProvider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "50px",
              }}
            >
              <Button
                onClick={() => {
                  setIsDrawerOpen(false);
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

export default AddDomainDrawer;
