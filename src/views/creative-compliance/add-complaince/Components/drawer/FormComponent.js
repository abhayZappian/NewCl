import React from "react";
import { Box, Typography, Checkbox, Button, TextField } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const FormComponent = ({
  formik,
  label,
  checkboxName,
  dateFieldName,
  textFieldName,
  buttonLabel,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginY: "20px",
      }}
    >
      <Box
        sx={{
          width: "92%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{  width: { lg: "35%" }, alignItems: "center" }}>
          <Typography variant="h4">{label}</Typography>
        </Box>
        <Box></Box>
        <Checkbox
          id={`${checkboxName}CheckBox`}
          name={`${checkboxName}CheckBox`}
          value={formik.values[`${checkboxName}CheckBox`]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            mt: 1,
            "& .MuiSvgIcon-root": {
              fontSize: "34px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: "4px",
            },
          }}
        />
        <Button
          variant="contained"
          disabled={!formik.values[`${checkboxName}CheckBox`]}
          onClick={() => formik.setFieldValue(dateFieldName, null)}
          sx={{
            mt: 1,
            display: "flex",
            width: "38px",
            height: "35px",
            minWidth: "30px",
            pr: 1,
          }}
          startIcon={
            <RestartAltIcon
              sx={{
                opacity: formik.values[`${checkboxName}CheckBox`] ? 1 : 0.5,
                ml: 0.5,
              }}
            />
          }
        >
          {buttonLabel}
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              value={
                formik.values[dateFieldName]
                  ? dayjs(formik.values[dateFieldName])
                  : null
              }
              disabled={!formik.values[`${checkboxName}CheckBox`]}
              label="Select Date"
              onChange={(newValue) => {
                const value = new Date(newValue.$d);
                const currentTime = new Date();
                value.setHours(currentTime.getHours());
                value.setMinutes(currentTime.getMinutes());
                value.setSeconds(currentTime.getSeconds());
                formik.setFieldValue(dateFieldName, value, true);
              }}
              slotProps={{
                textField: {
                  helperText: formik.errors[dateFieldName] || "",
                  error: Boolean(formik.errors[dateFieldName]),
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>
      <TextField
        disabled={!formik.values[`${checkboxName}CheckBox`]}
        sx={{  mt: 2, width: "92%" }}
        id={textFieldName}
        name={textFieldName}
        label={label}
        rows={6}
        multiline
        variant="outlined"
        fullWidth
        size="small"
        onChange={(e) => {
          const value = e.target.value.split("\n");
          formik.setFieldValue(textFieldName, value);
        }}
        onBlur={formik.handleBlur}
        value={formik?.values[textFieldName]?.join("\n")}
        error={
          formik.touched[textFieldName] && Boolean(formik.errors[textFieldName])
        }
        helperText={
          formik.touched[textFieldName] && formik.errors[textFieldName]
        }
      />
    </Box>
  );
};

export default FormComponent;
