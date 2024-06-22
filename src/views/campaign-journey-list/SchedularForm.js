import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectGetEmailSchedule } from "store/selectors";
import { enqueueSnackbar } from "notistack";
import { setDrawerOpen } from "store/action/journeyCanvas";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useEffect } from "react";
import * as Yup from "yup";
import axiosInstance from "helpers/apiService";
import { baseURL } from "config/envConfig";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import apiEndPoints from "helpers/APIEndPoints";
const validationSchema = Yup.object().shape({
  weekDays: Yup.mixed().required("Week Days is required"),
  startTimeRecurring: Yup.mixed().required("Start Time is required"),
  endTimeRecurring: Yup.mixed()
    .required("End Time is required")
    .test(
      "is-greater",
      "End time must be greater than start time",
      function (value) {
        const endTime = value;
        const { startTimeRecurring } = this.parent;
        return endTime > startTimeRecurring;
      }
    ),
  timeZoneRecurring: Yup.mixed().required("Time Zone is required"),
});
const validationSchemaOnce = Yup.object().shape({
  startTimeOnce: Yup.mixed().required("Start Time is required"),
  endTimeOnce: Yup.mixed()
    .required("End Time is required")
    .test(
      "is-greater",
      "End time must be greater than start time",
      function (value) {
        const endTime = value;
        console.log(value, "dfdfdkkk");
        const { startTimeOnce } = this.parent;
        console.log(startTimeOnce, "dfdfd");
        return endTime > startTimeOnce;
      }
    ),
  timeZoneOnce: Yup.mixed().required("Time Zone is required"),
  dateOnce: Yup.mixed().required("Start Time is required"),
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const weekDays = [
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
];

const SchedularForm = ({ journeyId, handleCloseDialog, getListData }) => {
  const initialJourneyId = journeyId;
  const initialDialogBox = handleCloseDialog;
  const [weekDayOptions, setWeekDayOptions] = useState([]);
  const intialScheduleData = useSelector(selectGetEmailSchedule) || {};
  const parsedStartTime = dayjs(
    `2022-04-17T${intialScheduleData.startTimeRecurring}`
  );
  const parsedEndTime = dayjs(
    `2022-04-17T${intialScheduleData.endTimeRecurring}`
  );
  const [timeZones, setTimeZone] = useState("");
  const [selectedOption, setSelectedOption] = useState("recurring");
  const parsedStartTimeOnce = dayjs(
    `2022-04-17T${intialScheduleData.startTimeOnce}`
  );
  const parsedEndTimeOnce = dayjs(
    `2022-04-17T${intialScheduleData.endTimeOnce}`
  );
  const getTimeZone = async () => {
    const res = await axiosInstance.get(`${baseURL}/cl/apis/v1/timeZone`);
    setTimeZone(res.data);
  };

  const getScheduleData = async () => {
    const { data } = await axiosInstance.get(
      `${apiEndPoints.getCampaignJourneyList}/${journeyId}`
    );
    if (data.schedule.type === "once") {
      const utcTime = moment.utc(data.schedule.startTimeOnce, "HH:mm");
      const istTime = utcTime.clone().utcOffset("+05:30");
      const istTimeString = istTime.format("HH:mm");
      const utcTime1 = moment.utc(data.schedule.endTimeOnce, "HH:mm");
      const istTime1 = utcTime1.clone().utcOffset("+05:30");
      const istTimeString1 = istTime1.format("HH:mm");
      setSelectedOption("once");
      formik.setFieldValue("type", "once");
      formik.setFieldValue("dateOnce", data.schedule.dateOnce);
      formik.setFieldValue("startTimeOnce", utcTime._i);
      formik.setFieldValue("endTimeOnce", utcTime1._i);
      formik.setFieldValue("timeZoneOnce", data.schedule.timeZoneOnce);
    }
    if (data.schedule.type === "recurring") {
      const utcTime = moment.utc(data.schedule.startTimeRecurring, "HH:mm");
      const istTime = utcTime.clone().utcOffset("+05:30");
      const istTimeString = istTime.format("HH:mm");
      const utcTime1 = moment.utc(data.schedule.endTimeRecurring, "HH:mm");
      const istTime1 = utcTime1.clone().utcOffset("+05:30");
      const istTimeString1 = istTime1.format("HH:mm");
      setSelectedOption("recurring");
      formik.setFieldValue("weekDays", data.schedule.weekDays);
      formik.setFieldValue("startTimeRecurring", utcTime._i);
      formik.setFieldValue("endTimeRecurring", utcTime1._i);
      formik.setFieldValue(
        "timeZoneRecurring",
        data.schedule.timeZoneRecurring
      );
      formik.setFieldValue("type", "recurring");
      console.log(formik);
    }
  };

  const scheduleJourney = async (data) => {
    try {
      const response = await axiosInstance.put(
        `${baseURL}/cl/apis/v1/scheduleJourney/${initialJourneyId}`,
        data
      );
      console.log(response, "resss");
      enqueueSnackbar("Form Submit Successfully !!!", {
        variant: "success",
      });
      initialDialogBox();
      formik.resetForm();
      setTimeout(() => {
        console.log("its loading");
        getListData();
      }, 300);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Form not Submit Successfully !!!", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    getScheduleData();
    getTimeZone();
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    setWeekDayOptions(weekDays);
  }, []);

  const formik = useFormik({
    initialValues: {
      type: intialScheduleData.type || "recurring",
      dateOnce: intialScheduleData.dateOnce || "",
      weekDays: intialScheduleData.weekDays,
      startTimeRecurring: parsedStartTime.isValid()
        ? parsedStartTime.toDate()
        : null,
      endTimeRecurring: parsedEndTime.isValid() ? parsedEndTime.toDate() : null,
      timeZoneRecurring: intialScheduleData.timeZoneRecurring || "",
      startTimeOnce: parsedStartTimeOnce.isValid()
        ? parsedStartTimeOnce.toDate()
        : null,
      endTimeOnce: parsedEndTimeOnce.isValid()
        ? parsedEndTimeOnce.toDate()
        : null,
      timeZoneOnce: intialScheduleData.timeZoneOnce || "",
    },
    validationSchema:
      selectedOption === "recurring" ? validationSchema : validationSchemaOnce,

    onSubmit: async (values) => {
      console.log("data submitted", values);
      if (selectedOption === "recurring") {
        const data = {
          type: selectedOption,
          weekDays: values.weekDays,
          // startTimeRecurring: moment(values.startTimeRecurring).format("HH:mm"),
          // endTimeRecurring: moment(values.endTimeRecurring).format("HH:mm"),
          startTimeRecurring: values.startTimeRecurring,
          endTimeRecurring: values.endTimeRecurring,
          timeZoneRecurring: values.timeZoneRecurring,
        };
        console.log(data);
        scheduleJourney(data);
        dispatch(setDrawerOpen(false));
      } else {
        const data = {
          type: selectedOption,
          // startTimeOnce: moment(values.startTimeOnce).format("HH:mm"),
          // endTimeOnce: moment(values.endTimeOnce).format("HH:mm"),
          startTimeOnce: values.startTimeOnce,
          endTimeOnce: values.endTimeOnce,
          timeZoneOnce: values.timeZoneOnce,
          dateOnce: values.dateOnce,
        };
        console.log(data);
        scheduleJourney(data);
        dispatch(setDrawerOpen(false));
      }
    },
  });
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    formik.setFieldValue("type", event.target.value);
  };
  const isBeforeYesterday = (date) => {
    const yesterday = dayjs().subtract(1, "day").startOf("day");
    return dayjs(date).isBefore(yesterday);
  };

  const disablePrevDates = (date) => (date) => {
    return isBeforeYesterday(date);
  };

  return (
    <div>
      <div>
        <div>
          <Box
            sx={{
              m: 1,
              width: "450px",
              margin: "24px",
              p: "50px 10px",
              height: "500px",
            }}
            noValidate
            autoComplete="off"
          >
            <form onSubmit={formik.handleSubmit}>
              <div>
                <Typography variant="h3" level="h2">
                  {" "}
                  Schedule Journey
                </Typography>
              </div>
              <div>
                <div>
                  <FormControl component="fieldset" sx={{ marginTop: 3 }}>
                    <RadioGroup
                      row
                      aria-label="options"
                      name="options"
                      value={formik.values.type}
                      onChange={handleOptionChange}
                    >
                      <FormControlLabel
                        value="recurring"
                        control={<Radio />}
                        label="Recurring"
                      />
                      <FormControlLabel
                        value="once"
                        control={<Radio />}
                        label="Once"
                      />
                      {/* <FormControlLabel
                        value="realTime"
                        control={<Radio />}
                        label="Real Time"
                      /> */}
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>

              {selectedOption === "recurring" && (
                <>
                  {
                    <div>
                      <div style={{ marginTop: "10px" }}>
                        <div>
                          <Autocomplete
                            multiple
                            id="weekDays"
                            name="weekDays"
                            options={weekDayOptions}
                            value={formik.values.weekDays || []}
                            onChange={(e, newValue) =>
                              formik.setFieldValue("weekDays", newValue, true)
                            }
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.label}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {option.label}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Select Week Days"
                                placeholder="Week Days"
                              />
                            )}
                          />
                          {formik.touched.weekDays &&
                            formik.errors.weekDays && (
                              <div style={{ color: "red" }} className="error">
                                {formik.errors.weekDays}
                              </div>
                            )}
                        </div>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack
                              spacing={2}
                              sx={{ minWidth: 210, marginTop: 3 }}
                            >
                              <TimePicker
                                name="startTimeRecurring"
                                value={dayjs(
                                  `2022-04-17T${formik.values?.startTimeRecurring}`
                                )}
                                onChange={(newValue) => {
                                  console.log("newValue.$d----", newValue.$d);
                                  formik.setFieldValue(
                                    "startTimeRecurring",
                                    moment(newValue.$d).format("HH:mm"),
                                    true
                                  );
                                }}
                                referenceDate={dayjs("2022-04-17")}
                              />
                              {formik.touched.startTimeRecurring &&
                                formik.errors.startTimeRecurring && (
                                  <div
                                    style={{ color: "red" }}
                                    className="error"
                                  >
                                    {formik.errors.startTimeRecurring}
                                  </div>
                                )}
                            </Stack>
                          </LocalizationProvider>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack
                              spacing={2}
                              sx={{ minWidth: 210, marginTop: 3 }}
                            >
                              <TimePicker
                                name="endTimeRecurring"
                                value={dayjs(
                                  `2022-04-17T${formik.values?.endTimeRecurring}`
                                )}
                                onChange={(newValue) => {
                                  console.log("newValue.$d----", newValue.$d);
                                  formik.setFieldValue(
                                    "endTimeRecurring",
                                    moment(newValue.$d).format("HH:mm"),
                                    true
                                  );
                                }}
                                referenceDate={dayjs("2022-04-17")}
                              />
                              {formik.touched.endTimeRecurring &&
                                formik.errors.endTimeRecurring && (
                                  <div
                                    style={{ color: "red" }}
                                    className="error"
                                  >
                                    {formik.errors.endTimeRecurring}
                                  </div>
                                )}
                            </Stack>
                          </LocalizationProvider>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Autocomplete
                            id="timeZoneRecurring"
                            name="timeZoneRecurring"
                            options={timeZones}
                            value={formik?.values?.timeZoneRecurring || null}
                            getOptionLabel={(option) => `${option.label}` || []}
                            onChange={(event, newValue) =>
                              formik.setFieldValue(
                                "timeZoneRecurring",
                                newValue,
                                true
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select a Time Zone"
                                variant="standard"
                              />
                            )}
                          />
                          {formik.touched.timeZoneRecurring &&
                            formik.errors.timeZoneRecurring && (
                              <div style={{ color: "red" }} className="error">
                                {formik.errors.timeZoneRecurring}
                              </div>
                            )}
                        </Box>
                      </div>
                    </div>
                  }
                </>
              )}
              {selectedOption === "once" && (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ minWidth: 305, marginTop: 1 }}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          shouldDisableDate={disablePrevDates(
                            dayjs().subtract(1, "day")
                          )}
                          fullWidth
                          name="dateOnce"
                          value={dayjs(formik.values?.dateOnce)}
                          // onChange={(newValue) =>
                          //   formik.setFieldValue("dateOnce", newValue.$d, true)
                          // }
                          onChange={(newValue) => {
                            const value = new Date(newValue.$d);
                            const currentTime = new Date();
                            value.setHours(currentTime.getHours());
                            value.setMinutes(currentTime.getMinutes());
                            value.setSeconds(currentTime.getSeconds());
                            formik.setFieldValue(`dateOnce`, value, true);
                          }}
                        />
                        {formik.touched.dateOnce && formik.errors.dateOnce && (
                          <div style={{ color: "red" }} className="error">
                            {formik.errors.dateOnce}
                          </div>
                        )}
                      </DemoContainer>
                    </Stack>
                  </LocalizationProvider>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    {" "}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={2} sx={{ minWidth: 210, marginTop: 3 }}>
                        <TimePicker
                          name="startTimeOnce"
                          value={dayjs(
                            `2022-04-17T${formik.values?.startTimeOnce}`
                          )}
                          onChange={(newValue) => {
                            // console.log(
                            //   moment(newValue.startTimeOnce).format("HH:mm")
                            // );
                            // console.log("newValue.$d----", newValue.$d);
                            // formik.setFieldValue(
                            //   "startTimeOnce",
                            //   newValue.$d,
                            //   true
                            // );
                            formik.setFieldValue(
                              "startTimeOnce",
                              moment(newValue.$d).format("HH:mm")
                            );
                          }}
                          referenceDate={dayjs("2022-04-17")}
                        />
                        <Typography>
                          {formik.touched.startTimeOnce &&
                            formik.errors.startTimeOnce && (
                              <div style={{ color: "red" }} className="error">
                                {formik.errors.startTimeOnce}
                              </div>
                            )}
                          {/* Stored value: {formik.values.time ? formik.values.time.format("YYYY-MM-DD HH:mm:ss") : "null"} */}
                        </Typography>
                      </Stack>
                    </LocalizationProvider>
                    &nbsp; &nbsp; &nbsp;
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={1} sx={{ Width: 5, marginTop: 4 }}>
                        <TimePicker
                          name="endTimeOnce"
                          label="End Time"
                          value={dayjs(formik.values?.endTimeOnce)}
                          onChange={(newValue) => {
                            formik.setFieldValue(
                              "endTimeOnce",
                              newValue.$d,
                              true
                            );
                          }}
                          referenceDate={dayjs("2022-04-17")}
                        />
                        {formik.touched.endTimeOnce &&
                          formik.errors.endTimeOnce && (
                            <div style={{ color: "red" }} className="error">
                              {formik.errors.endTimeOnce}
                            </div>
                          )}
                      </Stack>
                    </LocalizationProvider> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={2} sx={{ minWidth: 210, marginTop: 3 }}>
                        <TimePicker
                          name="endTimeOnce"
                          value={dayjs(
                            `2022-04-17T${formik.values?.endTimeOnce}`
                          )}
                          onChange={(newValue) => {
                            // console.log("newValue.$d----", newValue.$d);
                            // formik.setFieldValue(
                            //   "endTimeOnce",
                            //   newValue.$d,
                            //   true
                            // );
                            formik.setFieldValue(
                              "endTimeOnce",
                              moment(newValue.$d).format("HH:mm")
                            );
                          }}
                          referenceDate={dayjs("2022-04-17")}
                        />
                        {formik.touched.endTimeOnce &&
                          formik.errors.endTimeOnce && (
                            <div style={{ color: "red" }} className="error">
                              {formik.errors.endTimeOnce}
                            </div>
                          )}
                      </Stack>
                    </LocalizationProvider>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Autocomplete
                      id="timeZoneOnce"
                      name="timeZoneOnce"
                      options={timeZones}
                      value={formik?.values?.timeZoneOnce || null}
                      getOptionLabel={(option) => `${option.label}` || ""}
                      onChange={(event, newValue) =>
                        formik.setFieldValue("timeZoneOnce", newValue, true)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select a Time Zone"
                          variant="standard"
                        />
                      )}
                    />
                    {formik.touched.timeZoneOnce &&
                      formik.errors.timeZoneOnce && (
                        <div style={{ color: "red" }} className="error">
                          {formik.errors.timeZoneOnce}
                        </div>
                      )}
                  </Box>
                </>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  sx={{ mt: 4 }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onChange={() => console.log(formik)}
                >
                  Submit
                </Button>
                <Button
                  sx={{ mt: 4 }}
                  onClick={() => {
                    handleCloseDialog();
                    setSelectedOption(null);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Close
                </Button>
              </Box>
            </form>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SchedularForm;
