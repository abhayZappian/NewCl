import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Stack,
  FormGroup,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import * as Yup from "yup";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "helpers/apiService";
import { baseURL, gatewayURL } from "config/envConfig";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import apiEndPoints from "helpers/APIEndPoints";
import { useDispatch, useSelector } from "react-redux";
import { selectTimeZone } from "store/selectors/common";
import { setTimeZone } from "store/action/common";
import advancedFormat from "dayjs/plugin/advancedFormat";
import moment from "moment";
const weekDays = [
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
];
const parsedTime = dayjs(`2022-04-17T${""}`);

const initialValues = {
  scheduleType: "date",
  date: "",
  // time: "",
  time: parsedTime.isValid() ? parsedTime.toDate() : null,
  timezone: "",
  dayTimezone: "",
  // dayTime: "",
  dayTime: parsedTime.isValid() ? parsedTime.toDate() : null,
  weekDays: [],
  repeat: "none",
  dailyTimezone: "",
  // dailyTime: "",
  dailyTime: parsedTime.isValid() ? parsedTime.toDate() : null,
};
const validationSchema = Yup.object().shape({
  scheduleType: Yup.string().required("Schedule Type is required"),
  date: Yup.string().when("scheduleType", {
    is: "date",
    then: Yup.string().required("Date is required"),
  }),
  time: Yup.string().when("scheduleType", {
    is: (value) => ["date"].includes(value),
    then: Yup.string().required("Time is required").nullable(false),
  }),
  timezone: Yup.mixed().when("scheduleType", {
    is: (value) => ["date"].includes(value),
    then: Yup.mixed().required("Timezone is required").nullable(false),
  }),
  repeat: Yup.mixed().when("scheduleType", {
    is: (value) => ["date"].includes(value),
    then: Yup.mixed().required("repeat is required").nullable(false),
  }),
  dailyTimezone: Yup.mixed().when("scheduleType", {
    is: (value) => ["daily"].includes(value),
    then: Yup.mixed().required("Timezone is required").nullable(false),
  }),
  dailyTime: Yup.string().when("scheduleType", {
    is: (value) => ["daily"].includes(value),
    then: Yup.string().required("Time is required").nullable(false),
  }),

  dayTimezone: Yup.mixed().when("scheduleType", {
    is: (value) => ["day"].includes(value),
    then: Yup.mixed().required("Timezone is required").nullable(false),
  }),
  dayTime: Yup.string().when("scheduleType", {
    is: (value) => ["day"].includes(value),
    then: Yup.string().required("Time is required").nullable(false),
  }),
  weekDays: Yup.array().when("scheduleType", {
    is: "day",
    then: Yup.array().min(1, "At least one day must be selected").required(),
  }),
});

const FlushSchedularForm = ({ segmentId, handleCloseDialog }) => {
  const initialTimezone = useSelector(selectTimeZone || []);
  const [timeZones, setTimeZones] = useState(initialTimezone);
  const dispatch = useDispatch();

  console.log(initialTimezone, "initialTimezoneinitialTimezoneinitialTimezone");

  useEffect(() => {
    if (initialTimezone?.length === 0) {
      getTimeZone();
    }
  }, []);

  useEffect(() => {
    if (segmentId) {
      getSegmentFlushById(segmentId);
    }
  }, [segmentId]);

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      const scheduleType = values.scheduleType;
      const dateValue = {
        scheduleType,
        date: values.date,
        time: values.time,
        repeat: values.repeat,
        timezone: values.timezone,
      };
      const dayValue = {
        scheduleType,
        weekDays: values.weekDays,
        time: values.dayTime,
        timezone: values.dayTimezone,
      };
      const dailyValue = {
        scheduleType,
        timezone: values.dailyTimezone,
        time: values.dailyTime,
      };
      if (scheduleType === "date") {
        addSchedular({ ...dateValue });
      }
      if (scheduleType === "day") {
        addSchedular({ ...dayValue });
      }
      if (scheduleType === "daily") {
        addSchedular({ ...dailyValue });
      }
    },
  });
  const getSegmentFlushById = async (segmentid) => {
    try {
      const res = await axiosInstance.get(
        `${gatewayURL}${apiEndPoints.updateFlushSchedular}/${segmentid}`
      );
      console.log(res?.data?.data);
      if (res?.data && res?.data?.data?.scheduleType) {
        const { scheduleType, timezone, time, date, weekDays, repeat } =
          res?.data?.data;

        formik.setFieldValue("scheduleType", scheduleType);

        switch (scheduleType) {
          case "date":
            console.log("inside data");
            formik.setFieldValue("date", date);
            formik.setFieldValue("timezone", timezone);
            formik.setFieldValue("time", time);
            formik.setFieldValue("repeat", repeat);
            break;
          case "daily":
            console.log("inside daily");
            formik.setFieldValue("dailyTimezone", timezone);
            formik.setFieldValue("dailyTime", time);
            break;
          case "day":
            console.log("inside day");
            formik.setFieldValue("weekDays", weekDays);
            formik.setFieldValue("dayTimezone", timezone);
            formik.setFieldValue("dayTime", time);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const getTimeZone = async () => {
    try {
      const res = await axiosInstance.get(`${baseURL}${apiEndPoints.timeZone}`);
      console.log(res.data, "dataaaaaa");
      dispatch(setTimeZone(res.data));
      setTimeZones(res.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const addSchedular = async (values) => {
    try {
      const res = await axiosInstance.post(
        `${gatewayURL}${apiEndPoints.addFlushSchedular}`,
        { ...values, segmentId }
      );
      console.log(res);
      if (res.status === 200) {
        enqueueSnackbar(`${res?.data?.message}`, {
          variant: "success",
        });
        // close
        handleCloseDialog();
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`${error?.response?.data?.msg}`, {
        variant: "error",
      });
    }
  };
    const isBeforeYesterday = (date) => {
      const yesterday = dayjs().subtract(-1, "day").startOf("day");
      return dayjs(date).isBefore(yesterday);
    };

const disablePrevDates = (date) => (date) => {
  return isBeforeYesterday(date);
};
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        sx={{
          marginBottom: "50px",
          // marginLeft: "10px",
          paddingX: "auto",
          width: "610px",
          // margin: "auto",
          height: "450px",
          display: "flex",
          justifyContent: "center",
          // paddingY: "10px",
        }}
        container
        spacing={2}
      >
        <Typography
          sx={{ marginTop: 2, marginBottom: 2, paddingTop: "8px" }}
          variant="h2"
        >
          Schedule Flush
        </Typography>
        <Box sx={{ height: "372px" }}>
          <Grid sx={{ marginBottom: "15px" }} item xs={12}>
            {/* <FormControl sx={{ width: "500px" }}>
              <InputLabel>Schedule Type</InputLabel>
              <Select
                name="scheduleType"
                value={formik.values.scheduleType}
                onChange={(e) => {
                  console.log(e);
                  formik.setFieldValue("scheduleType", e.target.value);
                }}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
            </FormControl> */}
            <Autocomplete
              sx={{ width: "500px" }}
              value={formik.values.scheduleType}
              onChange={(event, newValue) => {
                console.log(newValue);
                formik.setFieldValue("scheduleType", newValue);
              }}
              options={["date", "day", "daily"]}
              renderInput={(params) => (
                <TextField {...params} label="Schedule Type" />
              )}
            />
          </Grid>

          {formik.values?.scheduleType === "date" && (
            <>
              <Grid alignItems={"center"} item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      // disablePast
                      shouldDisableDate={disablePrevDates(
                        dayjs().subtract(1, "day")
                      )}
                      value={dayjs(formik.values.date)}
                      label="From Date"
                      size="medium"
                      // onChange={(newValue) =>
                      //   formik.setFieldValue(`date`, newValue.$d, true)
                      // }
                      onChange={(newValue) => {
                        const value = new Date(newValue.$d);
                        const currentTime = new Date();
                        value.setHours(currentTime.getHours());
                        value.setMinutes(currentTime.getMinutes());
                        value.setSeconds(currentTime.getSeconds());
                        formik.setFieldValue(`date`, value, true);
                      }}
                      sx={{ width: "500px" }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {formik.touched.date && formik.errors.date && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formik.errors.date}
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  sx={{ width: "500px", marginY: "15px" }}
                  id="timezone"
                  name="timezone"
                  options={timeZones}
                  value={formik?.values?.timezone || null}
                  getOptionLabel={(option) => {
                    return option.label;
                  }}
                  onChange={(event, newValue) =>
                    formik.setFieldValue("timezone", newValue, true)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select a Time Zone" />
                  )}
                />
                {formik.touched.timezone && formik.errors.timezone && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formik.errors.timezone}
                  </div>
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={1} sx={{ marginTop: 4 }}>
                    <TimePicker
                      sx={{ width: "500px" }}
                      name="time"
                      label="Time"
                      // value={dayjs(formik.values?.time)}
                      value={dayjs(`2022-04-17T${formik.values?.time}`) || null}
                      // onChange={(newValue) => {
                      //   console.log(newValue, "newValuenewValuenewValue");
                      //   formik.setFieldValue("time", newValue.$d, true);
                      // }}
                      onChange={(newValue) => {
                        console.log("newValue.$d----", newValue.$d);
                        formik.setFieldValue(
                          "time",
                          moment(newValue.$d).format("HH:mm"),
                          true
                        );
                      }}
                      referenceDate={dayjs("2022-04-17")}
                    />
                  </Stack>
                  {formik.touched.time && formik.errors.time && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formik.errors.time}
                    </div>
                  )}
                </LocalizationProvider>
                <Typography
                  sx={{ marginTop: 2, fontWeight: 200, marginLeft: 2 }}
                  variant="h4"
                >
                  Repeat
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    sx={{ marginLeft: 2, marginBottom: "15px" }}
                    row
                    name="repeat"
                    value={formik.values.repeat}
                    onChange={(e) => {
                      formik.handleChange(e);
                      console.log(e.target.value);
                      formik.setFieldValue("repeat", e?.target?.value);
                    }}
                  >
                    <FormControlLabel
                      value="none"
                      control={<Radio />}
                      label="None"
                    />
                    <FormControlLabel
                      value="monthly"
                      control={<Radio />}
                      label="Monthly"
                    />
                    <FormControlLabel
                      value="yearly"
                      control={<Radio />}
                      label="Yearly"
                    />
                  </RadioGroup>
                  {formik.touched.repeat && formik.errors.repeat && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formik.errors.repeat}
                    </div>
                  )}
                </FormControl>
              </Grid>
            </>
          )}

          {formik.values?.scheduleType === "day" && (
            <>
              <Grid item xs={12} sx={{ marginBottom: "15px" }}>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  name="weekDays"
                  options={weekDays}
                  getOptionLabel={(option) => option?.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Select Days"
                      placeholder=" Select Days"
                    />
                  )}
                  filterSelectedOptions
                  value={formik.values.weekDays}
                  onChange={(e, newValue) => {
                    formik.setFieldValue("weekDays", newValue);
                  }}
                  sx={{ width: "500px" }}
                />
                {formik.touched.weekDays && formik.errors.weekDays && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formik.errors.weekDays}
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: "15px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={1} style={{ marginTop: 4 }}>
                    <TimePicker
                      sx={{ width: "500px" }}
                      name="dayTime"
                      label="Start dayTime"
                      // value={dayjs(formik.values?.dayTime)}
                      value={dayjs(`2022-04-17T${formik.values?.dayTime}`)}
                      // onChange={(newValue) => {
                      //   formik.setFieldValue("dayTime", newValue.$d, true);
                      // }}
                      onChange={(newValue) => {
                        console.log("newValue.$d----", newValue.$d);
                        formik.setFieldValue(
                          "dayTime",
                          moment(newValue.$d).format("HH:mm"),
                          true
                        );
                      }}
                      referenceDate={dayjs("2022-04-17")}
                    />
                  </Stack>
                </LocalizationProvider>
                {formik.touched.dayTime && formik.errors.dayTime && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formik.errors.dayTime}
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: "15px" }}>
                {console.log(timeZones)}
                <Autocomplete
                  sx={{ width: "500px" }}
                  id="dayTimezone"
                  name="dayTimezone"
                  options={timeZones || []}
                  value={formik?.values?.dayTimezone || null}
                  getOptionLabel={(option) => {
                    return option.label;
                  }}
                  onChange={(event, newValue) =>
                    formik.setFieldValue("dayTimezone", newValue, true)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select a Time Zone"
                      variant="standard"
                    />
                  )}
                />
                {formik.touched.dayTimezone && formik.errors.dayTimezone && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formik.errors.timezone}
                  </div>
                )}
              </Grid>
            </>
          )}

          {formik.values.scheduleType === "daily" && (
            <Grid
              alignItems={"center"}
              sx={{ marginBottom: "15px" }}
              item
              xs={12}
            >
              <div
                style={{
                  // border: "2px solid green",
                  width: "35%",
                }}
              >
                <FormGroup sx={{ width: "240px" }}> </FormGroup>
              </div>
              <FormGroup sx={{ width: "240px" }}></FormGroup>

              <FormGroup sx={{ width: "240px" }}></FormGroup>
              <Grid item xs={12}>
                <Autocomplete
                  sx={{ width: "500px" }}
                  id="dailyTimezone"
                  name="dailyTimezone"
                  options={timeZones}
                  value={formik?.values?.dailyTimezone || null}
                  getOptionLabel={(option) => {
                    return option.label;
                  }}
                  onChange={(event, newValue) =>
                    formik.setFieldValue("dailyTimezone", newValue, true)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select a Time Zone" />
                  )}
                />
                {formik.touched.dailyTimezone &&
                  formik.errors.dailyTimezone && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formik.errors.dailyTimezone}
                    </div>
                  )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={1} sx={{ marginTop: 4 }}>
                    <TimePicker
                      sx={{ width: "500px" }}
                      name="dailyTime"
                      label="dailyTime"
                      // value={dayjs(formik.values?.dailyTime)}
                      value={dayjs(`2022-04-17T${formik.values?.dailyTime}`)}
                      // onChange={(newValue) => {
                      //   formik.setFieldValue("dailyTime", newValue.$d, true);
                      // }}
                      onChange={(newValue) => {
                        console.log("newValue.$d----", newValue.$d);
                        formik.setFieldValue(
                          "dailyTime",
                          moment(newValue.$d).format("HH:mm"),
                          true
                        );
                      }}
                      referenceDate={dayjs("2022-04-17")}
                    />
                  </Stack>
                  {formik.touched.dailyTime && formik.errors.dailyTime && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formik.errors.dailyTime}
                    </div>
                  )}
                </LocalizationProvider>
              </Grid>
            </Grid>
          )}
        </Box>
        <Grid sx={{ marginLeft: 5, marginTop: "-9px" }} item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FlushSchedularForm;
