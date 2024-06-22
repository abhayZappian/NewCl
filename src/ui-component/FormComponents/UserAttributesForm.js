import React from "react";
import { Typography } from "@mui/joy";
import { Box, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectGetFormData, selectListData } from "store/selectors";
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import {
  setDrawerOpen,
  setFormData,
  setListData,
} from "store/action/journeyCanvas";
import { useState } from "react";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { selectOperator, selectSegmentFields } from "store/selectors/common";
import { setOperator, setSegmentFields } from "store/action/common";

const validationSchema = Yup.object().shape({
  list: Yup.mixed().required("List required"),
  column: Yup.mixed().required("Columnrequired"),
  conditions: Yup.mixed().required("Condition required"),
  value: Yup.mixed().required("Value required"),
});

export const UserAttributesForm = () => {
  const dispatch = useDispatch();
  const intialFormData = useSelector(selectGetFormData) || {};
  const [value, setvalue] = useState({
    id: "",
  });

  const listData = useSelector(selectListData) || [];
  const initialSegmentFields = useSelector(selectSegmentFields) || [];
  const initialOperator = useSelector(selectOperator) || [];

  const [segmentListFields, setSegmentListFields] = useState(
    initialSegmentFields?.listFields
  );
  const [listOptions, setListOptions] = useState(listData);
  const [getOperators, setGetOperators] = useState(initialOperator);
  const [emailListRecordsByListId, setEmailListRecordsByListId] = useState([]);

  const fetchData = async () => {
    try {
      const listResponse = await axiosInstance.get(apiEndPoints.listData);
      const listData = listResponse.data;
      setListOptions(listData);
      dispatch(setListData(listData));
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };
  const getSegmentField = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${apiEndPoints.getAllSegmentFields}`
      );
      dispatch(setSegmentFields(data?.segmentFields));
      setSegmentListFields(data.segmentFields.listFields);
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const getConditions = async () => {
    try {
      const { data } = await axiosInstance.get(`${apiEndPoints.getOperators}`);
      setGetOperators(data);
      dispatch(setOperator(data));
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const getEmailListRecords = async (name) => {
    // debugger;
    if (formik?.values?.list?.listid && name) {
      const condition = name.replace(/\s/g, "").toLocaleLowerCase();
      try {
        const { data } = await axiosInstance.get(
          `${apiEndPoints.emailListRecordsByListId}/${value?.id}/${condition}`
        );
        setEmailListRecordsByListId(data);
        getFirstOptionLabel(data);
        if (data.status === "fail") {
          enqueueSnackbar(`${data.message}`, {
            variant: "error",
          });
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    }
  };
  
  const getFirstOptionLabel = (option) => {
    const firstProperty = Object.keys(option).find((key) => !!option[key]);
    return option[firstProperty] || "";
  };

  useEffect(() => {
    if (initialSegmentFields?.length === 0) {
      getSegmentField();
    }
    if (initialOperator.length === 0) {
      getConditions();
    }
    if (listData.length === 0) {
      fetchData();
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      list: intialFormData.list || "",
      column: intialFormData.column || null,
      conditions: intialFormData.conditions || "",
      value: intialFormData.value || null,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(setFormData(values));
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
        <div>
          <Typography level="h4"> User Attributes form </Typography>
        </div>
        <>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <Autocomplete
                id="list"
                options={listOptions}
                value={formik.values.list || null}
                getOptionLabel={(option) =>
                  `${option.list_name} (${option.records})`
                }
                onChange={(e, newValue) => {
                  // debugger;
                  setvalue({ id: newValue.listid });
                  formik.setFieldValue("list", newValue);
                  formik.setFieldValue("column", null);
                  formik.setFieldValue("value", null);
                  setEmailListRecordsByListId([]);
                }}
                renderInput={(params) => (
                  <TextField
                    error={formik.touched.list && Boolean(formik.errors.list)}
                    helperText={formik.touched.list && formik.errors.list}
                    {...params}
                    label="List"
                    variant="standard"
                  />
                )}
              />
            </div>
            <div>
              <Autocomplete
                disableClearable
                options={segmentListFields}
                getOptionLabel={(option) => option?.name}
                value={formik.values.column || null}
                onChange={(event, newValue) => {
                  formik.setFieldValue("column", newValue, true);
                  formik.setFieldValue("value", "");
                  getEmailListRecords(newValue.name);
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    variant="standard"
                    {...params}
                    label="Column"
                    error={
                      formik.touched.column && Boolean(formik.errors.column)
                    }
                    helperText={formik.touched.column && formik.errors.column}
                  />
                )}
                onBlur={formik.handleBlur}
              />
            </div>
            <div>
              <Autocomplete
                disableClearable
                options={getOperators}
                getOptionLabel={(option) => option?.label}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    variant="standard"
                    {...params}
                    label="Condition"
                    error={
                      formik.touched.conditions &&
                      Boolean(formik.errors.conditions)
                    }
                    helperText={
                      formik.touched.conditions && formik.errors.conditions
                    }
                  />
                )}
                value={formik.values.conditions || null}
                onChange={(event, newValue) => {
                  formik.setFieldValue("conditions", newValue);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
            <div>
              <Autocomplete
                disableClearable
                options={emailListRecordsByListId}
                getOptionLabel={(option) => getFirstOptionLabel(option)}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    variant="standard"
                    {...params}
                    label="Value"
                    error={formik.touched.value && Boolean(formik.errors.value)}
                    helperText={formik.touched.value && formik.errors.value}
                  />
                )}
                value={formik.values.value || null}
                onChange={(event, newValue) => {
                  formik.setFieldValue("value", newValue);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
            <Box
              sx={{
                width: 350,
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  dispatch(setFormData(null));
                  formik.resetForm();
                  formik.setFieldValue("list", "", true);
                  formik.setFieldValue("column", null, true);
                  formik.setFieldValue("conditions", "", true);
                  formik.setFieldValue("value", null, true);
                }}
              >
                Reset
              </Button>
            </Box>
          </form>
        </>
      </Box>
    </div>
  );
};
