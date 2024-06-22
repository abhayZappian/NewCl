import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerOpen, setFormData } from "store/action/journeyCanvas";
import { selectGetFormData } from "store/selectors";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  value1: Yup.string().trim().when(["list1", "column1"], {
    is: (list1, column1) => list1 && column1,
    then: Yup.string().required("Value is required"),
    otherwise: Yup.string(),
  }),
  value2: Yup.string().trim().when(["list2", "column2"], {
    is: (list2, column2) => list2 && column2,
    then: Yup.string().required("Value is required"),
    otherwise: Yup.string(),
  }),
  value3: Yup.string().trim().when(["list3", "column3"], {
    is: (list3, column3) => list3 && column3,
    then: Yup.string().required("Value is required"),
    otherwise: Yup.string(),
  }),
});

export const AddDateToField = () => {
  const dispatch = useDispatch();
  const intialFormData = useSelector(selectGetFormData) || {};
  console.log(intialFormData, "intialFormData");

  const [listData, setListData] = useState([]);
  const [segmentListFields, setSegmentListFields] = useState([]);
  useEffect(() => {
    getListsData();
    getSegmentField();
  }, []);

  const getListsData = async () => {
    try {
      const { data } = await axiosInstance.get(apiEndPoints.listData);
      setListData(data);
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const getSegmentField = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${apiEndPoints.getAllSegmentFields}`
      );
      console.log(data);
      setSegmentListFields(data.segmentFields.listFields);
      console.log(segmentListFields);
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const formik = useFormik({
    initialValues: {
      value1: intialFormData.value1 || "",
      value2: intialFormData.value2 || "",
      value3: intialFormData.value3 || "",
      list1: intialFormData.list1 || "",
      list2: intialFormData.list2 || "",
      list3: intialFormData.list3 || "",
      column1: intialFormData.column1 || "",
      column2: intialFormData.column2 || "",
      column3: intialFormData.column3 || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        value1: values.value1.trim(),
        value2: values.value2.trim(),
        value3: values.value3.trim(),
        list1: values.list1,
        list2: values.list2,
        list3: values.list3,
        column1: values.column1,
        column2: values.column2,
        column3: values.column3,
      }
      dispatch(setFormData(data));
      enqueueSnackbar("Form Submit Successfully !!!", {
        variant: "success",
      });
      dispatch(setDrawerOpen(false));
    },
  });
  return (
    <div>
      <Typography sx={{ m: 3 }} variant="h3">
        {" "}
        Add Data To Field{" "}
      </Typography>
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
          <Box>
            <Typography variant="body2">Sub Id 1</Typography>
            <TextField
              variant="standard"
              label="Value"
              type="text"
              fullWidth
              name="value1"
              value={formik.values.value1}
              onChange={formik.handleChange}
            />
            {formik.touched.value1 && formik.errors.value1 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.value1}
              </div>
            )}
            <Autocomplete
              id="list1"
              name="list1"
              required
              options={listData}
              value={
                listData.find(
                  (option) =>
                    option?.list_name === formik?.values?.list1?.list_name
                ) || null
              }
              getOptionLabel={(option) => `${option.list_name}`}
              onBlur={formik.handleBlur}
              onChange={(e, newValue) => {
                const selectedList = newValue ? newValue : "";
                formik.setFieldValue("list1", selectedList);
              }}
              renderInput={(params) => (
                <TextField label="List" variant="standard" {...params} />
              )}
            />
            {formik.touched.list1 && formik.errors.list1 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.list1}
              </div>
            )}
            <Autocomplete
              id="column1"
              name="column1"
              required
              options={segmentListFields}
              value={
                segmentListFields.find(
                  (option) => option?.name === formik?.values?.column1?.name
                ) || null
              }
              getOptionLabel={(option) => `${option.name}`}
              onBlur={formik.handleBlur}
              onChange={(e, newValue) => {
                const selectedList = newValue ? newValue : "";
                formik.setFieldValue("column1", selectedList);
              }}
              renderInput={(params) => (
                <TextField variant="standard" label="Column" {...params} />
              )}
            />
            {formik.touched.column1 && formik.errors.column1 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.column1}
              </div>
            )}
          </Box>
          <Box sx={{ mt: 6 }}>
            <Typography variant="body2">Sub Id 2</Typography>
            <TextField
              variant="standard"
              label="Value"
              type="text"
              fullWidth
              name="value2"
              value={formik.values.value2}
              onChange={formik.handleChange}
            />
            {formik.touched.value2 && formik.errors.value2 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.value2}
              </div>
            )}
            <Autocomplete
              id="list2"
              name="list2"
              required
              options={listData}
              value={
                listData.find(
                  (option) =>
                    option?.list_name === formik?.values?.list2?.list_name
                ) || null
              }
              getOptionLabel={(option) => `${option.list_name}`}
              onBlur={formik.handleBlur}
              onChange={(e, newValue) => {
                const selectedList = newValue ? newValue : "";
                formik.setFieldValue("list2", selectedList);
              }}
              renderInput={(params) => (
                <TextField variant="standard" label="List" {...params} />
              )}
            />
            {formik.touched.list2 && formik.errors.list2 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.list2}
              </div>
            )}
            <Autocomplete
              id="column2"
              name="column2"
              required
              options={segmentListFields}
              value={
                segmentListFields.find(
                  (option) => option?.name === formik?.values?.column2?.name
                ) || null
              }
              getOptionLabel={(option) => `${option.name}`}
              onBlur={formik.handleBlur}
              onChange={(e, newValue) => {
                const selectedList = newValue ? newValue : "";
                formik.setFieldValue("column2", selectedList);
              }}
              renderInput={(params) => (
                <TextField variant="standard" label="Column" {...params} />
              )}
            />
            {formik.touched.column2 && formik.errors.column2 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.column2}
              </div>
            )}
          </Box>
          <Box sx={{ mt: 6 }}>
            <Typography variant="body2">Sub Id 3</Typography>
            <TextField
              variant="standard"
              label="Value"
              type="text"
              fullWidth
              name="value3"
              value={formik.values.value3}
              onChange={formik.handleChange}
            />
            {formik.touched.value3 && formik.errors.value3 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.value3}
              </div>
            )}
            <Autocomplete
              id="list3"
              name="list3"
              required
              options={listData}
              value={
                listData.find(
                  (option) =>
                    option?.list_name === formik?.values?.list3?.list_name
                ) || null
              }
              getOptionLabel={(option) => `${option.list_name}`}
              onBlur={formik.handleBlur}
              onChange={(e, newValue) => {
                const selectedList = newValue ? newValue : "";
                formik.setFieldValue("list3", selectedList);
              }}
              renderInput={(params) => (
                <TextField variant="standard" label="List" {...params} />
              )}
            />
            {formik.touched.list3 && formik.errors.list3 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.list3}
              </div>
            )}
            <Autocomplete
              id="column3"
              name="column3"
              required
              options={segmentListFields}
              value={
                segmentListFields.find(
                  (option) => option?.name === formik?.values?.column3?.name
                ) || null
              }
              getOptionLabel={(option) => `${option.name}`}
              onBlur={formik.handleBlur}
              onChange={(e, newValue) => {
                console.log(newValue);
                const selectedList = newValue ? newValue : "";
                formik.setFieldValue("column3", selectedList);
              }}
              renderInput={(params) => (
                <TextField variant="standard" label="Column" {...params} />
              )}
            />
            {formik.touched.column3 && formik.errors.column3 && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.column3}
              </div>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "40px",
            }}
          >
            <Button variant="contained" type="submit">
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                dispatch(setFormData(null));
                formik.resetForm();
                formik.setFieldValue("value1", "", true);
                formik.setFieldValue("value2", "", true);
                formik.setFieldValue("value3", "", true);

                formik.setFieldValue("list1", "", true);
                formik.setFieldValue("list2", "", true);
                formik.setFieldValue("list3", "", true);

                formik.setFieldValue("column1", "", true);
                formik.setFieldValue("column2", "", true);
                formik.setFieldValue("column3", "", true);
              }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};
