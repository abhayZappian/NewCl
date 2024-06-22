import { useState } from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/joy";
import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Button, TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setDrawerOpen, setFormData } from "store/action/journeyCanvas";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { selectGetFormData } from "store/selectors";
import moment from "moment";

export const WaitForForm = () => {
  const dispatch = useDispatch();
  const intialFormData = useSelector(selectGetFormData) || {};
  console.log(intialFormData, "formdata");
  const [fixedSelected, setFixedSelected] = useState(false);

  const validationSchema = Yup.object({
    fieldKey: Yup.string().when("type", {
      is: (val) => val === "Relative" && !fixedSelected,
      then: Yup.string().required("Type is required"),
      otherwise: Yup.string(),
    }),
    value: Yup.string().when("type", {
      is: (val) => val === "Relative" && !fixedSelected,
      then: Yup.string().required("Type is required"),
      otherwise: Yup.string(),
    }),
  });

  const hours = Array.from({ length: 23 }, (_, i) =>
    (i + 1).toString().padStart(2, "")
  );
  const minutes = Array.from({ length: 59 }, (_, i) =>
    (i + 1 ).toString().padStart(2, "")
  );
  const hoursMinutes = Array.from({ length: 60 }, (_, i) =>
    (i).toString().padStart(2, "")
  );
  const Day = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "")
  );

  const SixDay = Array.from({ length: 7 }, (_, i) =>
    (i).toString().padStart(2, "")
  );
  const Week = Array.from({ length: 53 }, (_, i) =>
    (i + 1).toString().padStart(2, "")
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "")
  );
  const monthDays = Array.from({ length: 32 }, (_, i) =>
    (i ).toString().padStart(2, "")
  );

  const Year = Array.from({ length: 3 }, (_, i) =>
    (i + 1).toString().padStart(2, "")
  );
  const yearMonths = Array.from({ length: 13 }, (_, i) =>
  (i ).toString().padStart(2, "")
);
  const options = ["Minutes", "Hours", "Day", "Week", "Months", "Year"];
  const parsedTime = dayjs(`2022-04-17T${intialFormData.time}`);
  const parsedDayTime = dayjs(`2022-04-17T${intialFormData.dayTime}`);

  const formik = useFormik({
    initialValues: {
      type: intialFormData.type || "Relative",
      fieldKey: intialFormData.fieldKey || "",
      value: intialFormData.value || "",
      date: intialFormData.date || "",
      time: parsedTime.isValid() ? parsedTime.toDate() : null,
      dayTime: parsedDayTime.isValid() ? parsedDayTime.toDate() : null,
      hours: intialFormData.hours || "",
      minutes: intialFormData.minutes || "",
      Day: intialFormData.Day || "",
      Week: intialFormData.Week || "",
      months: intialFormData.months || "",
      Year: intialFormData.Year || "",
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.type === "Fixed") {
        const data = {
          date: moment(values.date).format("YYYY-MM-DDTHH:mm"),
          time: moment(values.time).format("HH:mm"),
          type: values.type,
        };
        console.log("data", data);
        dispatch(setFormData(data));
      } else if (values.fieldKey === "Minutes") {
        const data = {
          fieldKey: values.fieldKey,
          type: values.type,
          minutes: values?.minutes,
        };
        console.log("data", data);
        dispatch(setFormData(data));
      } else if (values.fieldKey === "Hours") {
        const data = {
          fieldKey: values.fieldKey,
          type: values.type,
          hours: values?.hours,
          minutes: values?.minutes,
        };
        console.log("data", data);
        dispatch(setFormData(data));
      } else if (values.fieldKey === "Day") {
        const data = {
          fieldKey: values.fieldKey,
          type: values.type,
          Day: values?.Day,
          time: moment(values.time).format("HH:mm"),
        };
        console.log("data", data);
        dispatch(setFormData(data));
      } else if (values.fieldKey === "Week") {
        const data = {
          fieldKey: values.fieldKey,
          type: values.type,
          Week: values?.Week,
          Day: values?.Day,
          time: moment(values.time).format("HH:mm"),
        };
        console.log("data", data);
        dispatch(setFormData(data));
      } else if (values.fieldKey === "Months") {
        const data = {
          fieldKey: values.fieldKey,
          type: values.type,
          months: values?.months,
          Day: values?.Day,
          time: moment(values.time).format("HH:mm"),
        };
        console.log("data", data);
        dispatch(setFormData(data));
      } else {
        const data = {
          time: moment(values.time).format("HH:mm"),
          fieldKey: values.fieldKey,
          type: values.type,
          Day: values?.Day,
          months: values?.months,
          Year: values?.Year,
        };

        console.log("data", data);
        dispatch(setFormData(data));
      }
      formik.resetForm();
      enqueueSnackbar("Form Submit Successfully !!!", {
        variant: "success",
      });
      dispatch(setDrawerOpen(false));
    },
  });
  return (
    <div>
      <Box
        sx={{
          m: 1,
          width: "350px",
          margin: "24px",
        }}
        noValidate
        autoComplete="off"
      >
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Typography level="h4"> Wait for form </Typography>
          </div>
          <div>
            <FormControl component="fieldset" sx={{ marginTop: 4 }}>
              <RadioGroup
                row
                aria-label="radios"
                name="radios"
                value={formik.values?.type}
                onChange={(e) => {
                  formik.setFieldValue("type", e.target.value, true);
                }}
              >
                <FormControlLabel
                  name="type"
                  value="Relative"
                  control={<Radio />}
                  label="Relative"
                />
                <FormControlLabel
                  name="type"
                  value="Fixed"
                  control={<Radio />}
                  label="Fixed"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {formik.values.type === "Relative" && (
            <div>
              <div style={{ marginTop: 4 }}>
                <Autocomplete
                  id="time-unit"
                  name="fieldKey"
                  options={options}
                  value={formik.values?.fieldKey}
                  onChange={(e, newValue) =>
                    formik.setFieldValue("fieldKey", newValue, true)
                  }
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      label="Select Relative Feild"
                      error={
                        formik.touched.fieldKey &&
                        Boolean(formik.errors.fieldKey)
                      }
                    />
                  )}
                />
                {formik.touched.fieldKey && formik.errors.fieldKey && (
                  <div className="error">{formik.errors.fieldKey}</div>
                )}
              </div>
              {formik.values.fieldKey === "Minutes" && (
                <div>
                  <Autocomplete
                    id="minutes"
                    name="minutes"
                    options={minutes}
                    value={formik.values.minutes} // Ensure that formik.values.minutes is a valid option in the 'minutes' array
                    onChange={(e, newValue) =>
                      formik.setFieldValue("minutes", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Minute"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                </div>
              )}
              {formik.values.fieldKey === "Hours" && (
                <div>
                  <Autocomplete
                    id="hour-picker"
                    name="hours"
                    value={formik.values?.hours}
                    options={hours}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("hours", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Hour"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    id="minute-picker"
                    name="minutes"
                    options={hoursMinutes}
                    value={formik.values?.minutes}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("minutes", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Minute"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                </div>
              )}
              {formik.values.fieldKey === "Day" && (
                <Box>
                  <div>
                    <Autocomplete
                      id="hour-picker"
                      name="Day"
                      options={Day}
                      value={formik.values?.Day}
                      onChange={(e, newValue) =>
                        formik.setFieldValue("Day", newValue, true)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Number of days"
                          variant="standard"
                          fullWidth
                        />
                      )}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={2} sx={{ minWidth: 305, marginTop: 3 }}>
                        <TimePicker
                          variant="standard"
                          name="time"
                          value={dayjs(formik.values?.time)}
                          onChange={(newValue) => {
                            console.log("newValue.$d----", newValue.$d);
                            formik.setFieldValue("time", newValue.$d, true);
                          }}
                          referenceDate={dayjs("2022-04-17")}
                        />
                        <Typography>
                          {/* Stored value: {formik.values.time ? formik.values.time.format("YYYY-MM-DD HH:mm:ss") : "null"} */}
                        </Typography>
                      </Stack>
                    </LocalizationProvider>
                  </div>
                </Box>
              )}
              {formik.values.fieldKey === "Week" && (
                <div>
                  <Autocomplete
                    id="minute-picker"
                    name="Week"
                    options={Week}
                    value={formik.values?.Week}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("Week", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Week"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    id="hour-picker"
                    name="Day"
                    options={SixDay}
                    value={formik.values?.Day}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("Day", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Number of days"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ minWidth: 305, marginTop: 3 }}>
                      <TimePicker
                        name="time"
                        value={dayjs(formik.values?.time)}
                        onChange={(newValue) => {
                          console.log("newValue.$d----", newValue.$d);
                          formik.setFieldValue("time", newValue.$d, true);
                        }}
                        referenceDate={dayjs("2022-04-17")}
                      />
                      <Typography>
                        {/* Stored value: {formik.values.time ? formik.values.time.format("YYYY-MM-DD HH:mm:ss") : "null"} */}
                      </Typography>
                    </Stack>
                  </LocalizationProvider>
                </div>
              )}
              {formik.values.fieldKey === "Months" && (
                <div>
                  <Autocomplete
                    id="hour-picker"
                    name="months"
                    options={months}
                    value={formik.values?.months}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("months", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Months"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    id="hour-picker"
                    name="Day"
                    options={monthDays}
                    value={formik.values?.Day}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("Day", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Number of days"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ minWidth: 305, marginTop: 3 }}>
                      <TimePicker
                        name="time"
                        value={dayjs(formik.values?.time)}
                        onChange={(newValue) => {
                          console.log("newValue.$d----", newValue.$d);
                          formik.setFieldValue("time", newValue.$d, true);
                        }}
                        referenceDate={dayjs("2022-04-17")}
                      />
                      <Typography>
                        {/* Stored value: {formik.values.time ? formik.values.time.format("YYYY-MM-DD HH:mm:ss") : "null"} */}
                      </Typography>
                    </Stack>
                  </LocalizationProvider>
                </div>
              )}
              {formik.values.fieldKey === "Year" && (
                <div>
                  <Autocomplete
                    id="hour-picker"
                    name="Year"
                    options={Year}
                    value={formik.values?.Year}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("Year", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Year"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    id="hour-picker"
                    name="months"
                    options={yearMonths}
                    value={formik.values?.months}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("months", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Months"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete
                    id="hour-picker"
                    name="Day"
                    options={monthDays}
                    value={formik.values?.Day}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("Day", newValue, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Number of days"
                        variant="standard"
                        fullWidth
                      />
                    )}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ minWidth: 305, marginTop: 3 }}>
                      <TimePicker
                        name="time"
                        value={dayjs(formik.values?.time)}
                        onChange={(newValue) => {
                          console.log("newValue.$d----", newValue.$d);
                          formik.setFieldValue("time", newValue.$d, true);
                        }}
                        referenceDate={dayjs("2022-04-17")}
                      />
                      <Typography>
                        {/* Stored value: {formik.values.time ? formik.values.time.format("YYYY-MM-DD HH:mm:ss") : "null"} */}
                      </Typography>
                    </Stack>
                  </LocalizationProvider>
                </div>
              )}
            </div>
          )}
          {formik.values.type === "Fixed" && (
            <div>
              <div style={{ marginTop: "25px" }}>
                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={2} sx={{ minWidth: 305, marginTop: 1 }}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            fullWidth
                            name="date"
                            value={dayjs(formik.values?.date)}
                            onChange={(newValue) =>
                              formik.setFieldValue("date", newValue.$d, true)
                            }
                          />
                        </DemoContainer>
                      </Stack>
                    </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ minWidth: 305, marginTop: 2 }}>
                      <TimePicker
                        name="time"
                        value={dayjs(formik.values?.time)}
                        onChange={(newValue) => {
                          formik.setFieldValue("time", newValue.$d, true);
                        }}
                        referenceDate={dayjs("2022-04-17")}
                      />
                      <Typography>
                        {/* Stored value: {formik.values.time ? formik.values.time.format("YYYY-MM-DD HH:mm:ss") : "null"} */}
                      </Typography>
                    </Stack>
                  </LocalizationProvider>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
            <Button
              sx={{ mt: 3 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                dispatch(
                  setFormData({
                    type:  "Relative",
                    fieldKey:"",
                    value:  "",
                    date:  "",
                    time:  null,
                    dayTime: null,
                    hours:  "",
                    minutes:  "",
                    Day:  "",
                    Week:  "",
                    months: "",
                    Year:  "",
                  })
                );
                formik.resetForm();
                formik.setFieldValue("type", "Relative");
                formik.setFieldValue("fieldKey", "");
                formik.setFieldValue("value", "");
                formik.setFieldValue("time", null);
                formik.setFieldValue("dayTime", null);
                formik.setFieldValue("hours", "");
                formik.setFieldValue("minutes", "");
                formik.setFieldValue("Day", "");
                formik.setFieldValue("Week", "");
                formik.setFieldValue("months", "");
                formik.setFieldValue("Year", "");
                formik.setFieldValue("date","");


              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
};
