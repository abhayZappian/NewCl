import {
  Box,
  Button,
  IconButton,
  Drawer,
  Typography,
  Autocomplete,
  Paper,
  TextField,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import * as Yup from "yup";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { selectGetFormData, selectListData } from "store/selectors";
import { selectOperator, selectSegmentFields } from "store/selectors/common";
import {
  setDrawerOpen,
  setFormData,
  setListData,
  setSplitBranchName,
} from "store/action/journeyCanvas";
import { setOperator, setSegmentFields } from "store/action/common";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { enqueueSnackbar } from "notistack";
import { styled } from "@mui/system";
const validationSchema = Yup.object().shape({
  branches: Yup.array().of(
    Yup.object().shape({
      value: Yup.mixed().required("Branch Name Required"),
      percentage: Yup.string()
        .matches(
          /^100(?:\.0{1,2})?$|^(\d{1,2}(?:\.\d{1,2})?)$/,
          "Invalid percentage"
        )
        .required("Percentage Number Required"),
    })
  ),
});
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
export const SplitForm = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [index, setindex] = useState();
  const intialFormDataa = useSelector(selectGetFormData) || {};
  // console.log(intialFormDataa, "intial");

  const formik = useFormik({
    initialValues: {
      branches: intialFormDataa?.branches
        ? intialFormDataa?.branches?.map((item) => ({
            value: item?.value || "",
            percentage: item?.percentage || "",
          }))
        : [
            { value: "", percentage: "" },
            { value: "", percentage: "" },
          ],
      ///// 1 branch
      branch1List: "" || intialFormDataa.branch1List,
      branch1Column: null || intialFormDataa.branch1Column,
      branch1Condition: "" || intialFormDataa.branch1Condition,
      branch1Value: null || intialFormDataa.branch1Value,
      ///// 2 branch
      branch2List: "" || intialFormDataa.branch2List,
      branch2Column: null || intialFormDataa.branch2Column,
      branch2Condition: "" || intialFormDataa.branch2Condition,
      branch2Value: null || intialFormDataa.branch2Value,
      ///// 3 branch
      branch3List: "" || intialFormDataa.branch3List,
      branch3Column: null || intialFormDataa.branch3Column,
      branch3Condition: "" || intialFormDataa.branch3Condition,
      branch3Value: null || intialFormDataa.branch3Value,
      ///// 4 branch
      branch4List: "" || intialFormDataa.branch4List,
      branch4Column: null || intialFormDataa.branch4Column,
      branch4Condition: "" || intialFormDataa.branch4Condition,
      branch4Value: null || intialFormDataa.branch4Value,
      ///// 5 branch
      branch5List: "" || intialFormDataa.branch5List,
      branch5Column: null || intialFormDataa.branch5Column,
      branch5Condition: "" || intialFormDataa.branch5Condition,
      branch5Value: null || intialFormDataa.branch5Value,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values.branches);
      const totalPercentage = values.branches.reduce(
        (acc, curr) => acc + curr.percentage,
        0
      );
      // Check if total percentage is greater than 100
      if (totalPercentage !== 100) {
        enqueueSnackbar("Total percentage should be equal to  100", {
          variant: "error",
        });
      } else {
        console.log("Total percentage is within limits.");
        const data = {
          branches: values.branches,
          branch1List:
            values.branch1List === undefined ? "" : values.branch1List,
          branch1Column:
            values.branch1Column === undefined ? "" : values.branch1Column,
          branch1Condition:
            values.branch1Condition === undefined
              ? ""
              : values.branch1Condition,
          branch1Value:
            values.branch1Value === undefined ? "" : values.branch1Value,
          //// index 1
          branch2List:
            values.branch2List === undefined ? "" : values.branch2List,
          branch2Column:
            values.branch2Column === undefined ? "" : values.branch2Column,
          branch2Condition:
            values.branch2Condition === undefined
              ? ""
              : values.branch2Condition,
          branch2Value:
            values.branch2Value === undefined ? "" : values.branch2Value,
          /// index 2
          branch3List:
            values.branch3List === undefined ? "" : values.branch3List,
          branch3Column:
            values.branch3Column === undefined ? "" : values.branch3Column,
          branch3Condition:
            values.branch3Condition === undefined
              ? ""
              : values.branch3Condition,
          branch3Value:
            values.branch3Value === undefined ? "" : values.branch3Value,
          /// index 3
          branch4List:
            values.branch4List === undefined ? "" : values.branch4List,
          branch4Column:
            values.branch4Column === undefined ? "" : values.branch4Column,
          branch4Condition:
            values.branch4Condition === undefined
              ? ""
              : values.branch4Condition,
          branch4Value:
            values.branch4Value === undefined ? "" : values.branch4Value,
          /// index 4
          branch5List:
            values.branch5List === undefined ? "" : values.branch5List,
          branch5Column:
            values.branch5Column === undefined ? "" : values.branch5Column,
          branch5Condition:
            values.branch5Condition === undefined
              ? ""
              : values.branch5Condition,
          branch5Value:
            values.branch5Value === undefined ? "" : values.branch5Value,
        };
        console.log(data, "data");
        dispatch(setFormData(data));
        dispatch(setSplitBranchName(values.branches));
        enqueueSnackbar("Form Submit Successfully !!!", {
          variant: "success",
        });
        dispatch(setDrawerOpen(false));
      }
    },
  });
  const addBranch = () => {
    if (formik.values.branches.length < 5) {
      formik.setValues({
        ...formik.values,
        branches: [...formik.values.branches, { value: "", percentage: "" }],
      });
    }
  };

  const removeBranch = (index) => {
    const updatedBranches = [...formik.values.branches];
    updatedBranches.splice(index, 1);
    formik.setValues({
      ...formik.values,
      branches: updatedBranches,
    });
    if (index) {
      console.log(index, "index");
    }
    if (index === 4) {
      formik.setFieldValue("branch5List", "");
      formik.setFieldValue("branch5Column", null);
      formik.setFieldValue("branch5Condition", "");
      formik.setFieldValue("branch5Value", null);
    }
    if (index === 3) {
      formik.setFieldValue("branch4List", "");
      formik.setFieldValue("branch4Column", null);
      formik.setFieldValue("branch4Condition", "");
      formik.setFieldValue("branch4Value", null);
      //////////////////////////
      formik.setFieldValue("branch4List", formik.values.branch5List);
      formik.setFieldValue("branch4Column", formik.values.branch5Column);
      formik.setFieldValue("branch4Condition", formik.values.branch5Condition);
      formik.setFieldValue("branch4Value", formik.values.branch5Value);
      //////////////////////////
      formik.setFieldValue("branch5List", "");
      formik.setFieldValue("branch5Column", null);
      formik.setFieldValue("branch5Condition", "");
      formik.setFieldValue("branch5Value", null);
    }
    if (index === 2) {
      formik.setFieldValue("branch3List", "");
      formik.setFieldValue("branch3Column", null);
      formik.setFieldValue("branch3Condition", "");
      formik.setFieldValue("branch3Value", null);
      //////////////////////////
      formik.setFieldValue("branch3List", formik.values.branch4List);
      formik.setFieldValue("branch3Column", formik.values.branch4Column);
      formik.setFieldValue("branch3Condition", formik.values.branch4Condition);
      formik.setFieldValue("branch3Value", formik.values.branch4Value);
      //////////////////////////
      formik.setFieldValue("branch4List", formik.values.branch5List);
      formik.setFieldValue("branch4Column", formik.values.branch5Column);
      formik.setFieldValue("branch4Condition", formik.values.branch5Condition);
      formik.setFieldValue("branch4Value", formik.values.branch5Value);
      //////////////////////////
      formik.setFieldValue("branch5List", "");
      formik.setFieldValue("branch5Column", null);
      formik.setFieldValue("branch5Condition", "");
      formik.setFieldValue("branch5Value", null);
    }
    if (index === 1) {
      formik.setFieldValue("branch2List", "");
      formik.setFieldValue("branch2Column", null);
      formik.setFieldValue("branch2Condition", "");
      formik.setFieldValue("branch2Value", null);
      //////////////////////////
      formik.setFieldValue("branch2List", formik.values.branch3List);
      formik.setFieldValue("branch2Column", formik.values.branch3Column);
      formik.setFieldValue("branch2Condition", formik.values.branch3Condition);
      formik.setFieldValue("branch2Value", formik.values.branch3Value);
      //////////////////////////
      formik.setFieldValue("branch3List", formik.values.branch4List);
      formik.setFieldValue("branch3Column", formik.values.branch4Column);
      formik.setFieldValue("branch3Condition", formik.values.branch4Condition);
      formik.setFieldValue("branch3Value", formik.values.branch4Value);
      //////////////////////////
      formik.setFieldValue("branch4List", formik.values.branch5List);
      formik.setFieldValue("branch4Column", formik.values.branch5Column);
      formik.setFieldValue("branch4Condition", formik.values.branch5Condition);
      formik.setFieldValue("branch4Value", formik.values.branch5Value);
      //////////////////////////
      formik.setFieldValue("branch5List", "");
      formik.setFieldValue("branch5Column", null);
      formik.setFieldValue("branch5Condition", "");
      formik.setFieldValue("branch5Value", null);
    }
    if (index === 0) {
      formik.setFieldValue("branch1List", "");
      formik.setFieldValue("branch1Column", null);
      formik.setFieldValue("branch1Condition", "");
      formik.setFieldValue("branch1Value", null);
      ////
      formik.setFieldValue("branch1List", formik.values.branch2List);
      formik.setFieldValue("branch1Column", formik.values.branch2Column);
      formik.setFieldValue("branch1Condition", formik.values.branch2Condition);
      formik.setFieldValue("branch1Value", formik.values.branch2Value);
      ///
      formik.setFieldValue("branch2List", formik.values.branch3List);
      formik.setFieldValue("branch2Column", formik.values.branch3Column);
      formik.setFieldValue("branch2Condition", formik.values.branch3Condition);
      formik.setFieldValue("branch2Value", formik.values.branch3Value);
      //////////////////////////
      formik.setFieldValue("branch3List", formik.values.branch4List);
      formik.setFieldValue("branch3Column", formik.values.branch4Column);
      formik.setFieldValue("branch3Condition", formik.values.branch4Condition);
      formik.setFieldValue("branch3Value", formik.values.branch4Value);
      //////////////////////////
      formik.setFieldValue("branch4List", formik.values.branch5List);
      formik.setFieldValue("branch4Column", formik.values.branch5Column);
      formik.setFieldValue("branch4Condition", formik.values.branch5Condition);
      formik.setFieldValue("branch4Value", formik.values.branch5Value);
      //////////////////////////
      formik.setFieldValue("branch5List", "");
      formik.setFieldValue("branch5Column", null);
      formik.setFieldValue("branch5Condition", "");
      formik.setFieldValue("branch5Value", null);
    }
  };

  const handleOpenDrawer = (index) => {
    setindex(index);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    // debugger
    setIsDrawerOpen(false);
    setEmailListRecordsByListId([]);
  };

  //... user atribute api's

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
      throw error;
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
    // if (formik?.values?.list?.listid && name) {
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
    // }
  };

  const getFirstOptionLabel = (option) => {
    const firstProperty = Object.keys(option).find((key) => !!option[key]);
    return option[firstProperty] || "";
  };

  useEffect(() => {
    getSegmentField();
    getConditions();
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        m: 1,
        width: "50vw",
        margin: "24px",
      }}
      noValidate
      autoComplete="off"
    >
      <Typography sx={{ mb: 2 }} variant="h4">
        Split Form
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <Paper elevation={3} sx={{ p: "40px" }}>
            {formik.values.branches.map((branch, index) => (
              <div key={index}>
                <TextField
                  // sx={{ backgroundColor: "red" }}
                  id={`branchField-${index}`}
                  name={`branches[${index}].value`}
                  label={`Branch ${index + 1}`}
                  variant="standard"
                  value={branch.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.branches &&
                    formik.touched.branches[index] &&
                    Boolean(formik.errors.branches?.[index]?.value)
                  }
                  helperText={
                    formik.touched.branches &&
                    formik.touched.branches[index] &&
                    formik.errors.branches?.[index]?.value && (
                      <span style={{ color: "red" }}>
                        {formik.errors.branches[index].value}
                      </span>
                    )
                  }
                />
                <TextField
                  sx={{ ml: 3, width: "160px  " }}
                  type="number"
                  onKeyDown={(evt) =>
                    (evt.key === "-" || evt.key === "e" || evt.key === "E") &&
                    evt.preventDefault()
                  }
                  id={`percentageField-${index}`}
                  name={`branches[${index}].percentage`}
                  label={`Percentage ${index + 1}`}
                  variant="standard"
                  value={branch.percentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.branches &&
                    formik.touched.branches[index] &&
                    Boolean(formik.errors.branches?.[index]?.percentage)
                  }
                  helperText={
                    formik.touched.branches &&
                    formik.touched.branches[index] &&
                    formik.errors.branches?.[index]?.percentage && (
                      <span style={{ color: "red" }}>
                        {formik.errors.branches[index].percentage}
                      </span>
                    )
                  }
                />
                <LightTooltip title="Remove Branch">
                  <IconButton
                    onClick={() => removeBranch(index)}
                    sx={{ mt: 2, ml: 4 }}
                    color="error"
                    aria-label="delete"
                    disabled={formik.values.branches.length < 3}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </LightTooltip>
                <LightTooltip title="Open Form">
                  <IconButton
                    sx={{ ml: 0, mt: 2 }}
                    onClick={() => {
                      handleOpenDrawer(index);
                    }}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </LightTooltip>
              </div>
            ))}
          </Paper>
        </div>
        <div>
          <Button
            sx={{ mt: 4, borderRadius: "22px", marginRight: 2 }}
            variant="outlined"
            onClick={addBranch}
            disabled={formik.values.branches.length === 5}
          >
            Add Branch
          </Button>
        </div>

        <Button
          sx={{ mt: 3, borderRadius: "22px" }}
          variant="contained"
          type="submit"
        >
          Submit
        </Button>

        <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
          <Box
            sx={{
              width: "350px",
              padding: 2,
            }}
          >
            {index === 0 && (
              <Box>
                <>
                  <div>
                    <Autocomplete
                      id="branch1List"
                      name="branch1List"
                      options={listOptions}
                      value={formik.values.branch1List || null}
                      getOptionLabel={(option) =>
                        `${option.list_name} (${option.records})`
                      }
                      onChange={(e, newValue) => {
                        setvalue({ id: newValue.listid });
                        formik.setFieldValue("branch1List", newValue);
                        formik.setFieldValue("branch1Column", null);
                        formik.setFieldValue("branch1Value", null);
                        setEmailListRecordsByListId([]);
                      }}
                      renderInput={(params) => (
                        <TextField
                          error={
                            formik.touched.list && Boolean(formik.errors.list)
                          }
                          helperText={formik.touched.list && formik.errors.list}
                          {...params}
                          label="Branch 1 List"
                          variant="standard"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch1Column"
                      disableClearable
                      options={segmentListFields}
                      getOptionLabel={(option) => option?.name}
                      value={formik.values.branch1Column || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch1Column", newValue, true);
                        formik.setFieldValue("branch1Value", "");
                        if (formik.values.branch1List) {
                          getEmailListRecords(newValue.name);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 1 Column"
                          error={
                            formik.touched.column &&
                            Boolean(formik.errors.column)
                          }
                          helperText={
                            formik.touched.column && formik.errors.column
                          }
                        />
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch1Condition"
                      disableClearable
                      options={getOperators}
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 1 Condition"
                          error={
                            formik.touched.conditions &&
                            Boolean(formik.errors.conditions)
                          }
                          helperText={
                            formik.touched.conditions &&
                            formik.errors.conditions
                          }
                        />
                      )}
                      value={formik.values.branch1Condition || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch1Condition", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch1Value"
                      disableClearable
                      options={emailListRecordsByListId}
                      getOptionLabel={(option) => getFirstOptionLabel(option)}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 1 Value"
                          error={
                            formik.touched.value && Boolean(formik.errors.value)
                          }
                          helperText={
                            formik.touched.value && formik.errors.value
                          }
                        />
                      )}
                      value={formik.values.branch1Value || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch1Value", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <Box
                    sx={{
                      marginTop: 4,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setEmailListRecordsByListId([]);
                        enqueueSnackbar(`Form Updated Successfully`, {
                          variant: "success",
                        });
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        formik.setFieldValue("branch1List", null);
                        formik.setFieldValue("branch1Column", null);
                        formik.setFieldValue("branch1Condition", null);
                        formik.setFieldValue("branch1Value", null);
                        setEmailListRecordsByListId([]);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Clear
                    </Button>
                  </Box>
                </>
              </Box>
            )}
            {index === 1 && (
              <Box>
                <>
                  <div>
                    <Autocomplete
                      id="branch2List"
                      name="branch2List"
                      options={listOptions}
                      value={formik.values.branch2List || null}
                      getOptionLabel={(option) =>
                        `${option.list_name} (${option.records})`
                      }
                      onChange={(e, newValue) => {
                        setvalue({ id: newValue.listid });
                        formik.setFieldValue("branch2List", newValue);
                        formik.setFieldValue("branch2Column", null);
                        formik.setFieldValue("branch2Value", null);
                        setEmailListRecordsByListId([]);
                      }}
                      renderInput={(params) => (
                        <TextField
                          error={
                            formik.touched.list && Boolean(formik.errors.list)
                          }
                          helperText={formik.touched.list && formik.errors.list}
                          {...params}
                          label="Branch 2 List"
                          variant="standard"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch2Column"
                      disableClearable
                      options={segmentListFields}
                      getOptionLabel={(option) => option?.name}
                      value={formik.values.branch2Column || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch2Column", newValue, true);
                        formik.setFieldValue("branch2Value", "");
                        if (formik.values.branch2List) {
                          getEmailListRecords(newValue.name);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 2 Column"
                          error={
                            formik.touched.column &&
                            Boolean(formik.errors.column)
                          }
                          helperText={
                            formik.touched.column && formik.errors.column
                          }
                        />
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch2Condition"
                      disableClearable
                      options={getOperators}
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 2 Condition"
                          error={
                            formik.touched.conditions &&
                            Boolean(formik.errors.conditions)
                          }
                          helperText={
                            formik.touched.conditions &&
                            formik.errors.conditions
                          }
                        />
                      )}
                      value={formik.values.branch2Condition || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch2Condition", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch2Value"
                      disableClearable
                      options={emailListRecordsByListId}
                      getOptionLabel={(option) => getFirstOptionLabel(option)}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 2 Value"
                          error={
                            formik.touched.value && Boolean(formik.errors.value)
                          }
                          helperText={
                            formik.touched.value && formik.errors.value
                          }
                        />
                      )}
                      value={formik.values.branch2Value || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch2Value", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <Box
                    sx={{
                      // width: 350,
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        enqueueSnackbar(`Form Updated Successfully`, {
                          variant: "success",
                        });
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        formik.setFieldValue("branch2List", null);
                        formik.setFieldValue("branch2Column", null);
                        formik.setFieldValue("branch2Condition", null);
                        formik.setFieldValue("branch2Value", null);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Clear
                    </Button>
                  </Box>
                </>
              </Box>
            )}
            {index === 2 && (
              <Box>
                <>
                  <div>
                    <Autocomplete
                      id="branch3List"
                      name="branch3List"
                      options={listOptions}
                      value={formik.values.branch3List || null}
                      getOptionLabel={(option) =>
                        `${option.list_name} (${option.records})`
                      }
                      onChange={(e, newValue) => {
                        setvalue({ id: newValue.listid });
                        formik.setFieldValue("branch3List", newValue);
                        formik.setFieldValue("branch3Column", null);
                        formik.setFieldValue("branch3Value", null);
                        setEmailListRecordsByListId([]);
                      }}
                      renderInput={(params) => (
                        <TextField
                          error={
                            formik.touched.list && Boolean(formik.errors.list)
                          }
                          helperText={formik.touched.list && formik.errors.list}
                          {...params}
                          label="Branch 3 List"
                          variant="standard"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch3Column"
                      disableClearable
                      options={segmentListFields}
                      getOptionLabel={(option) => option?.name}
                      value={formik.values.branch3Column || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch3Column", newValue, true);
                        formik.setFieldValue("branch3Value", "");
                        if (formik.values.branch3List) {
                          getEmailListRecords(newValue.name);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label=" Branch 3 Column"
                          error={
                            formik.touched.column &&
                            Boolean(formik.errors.column)
                          }
                          helperText={
                            formik.touched.column && formik.errors.column
                          }
                        />
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch3Condition"
                      disableClearable
                      options={getOperators}
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label=" Branch 3 Condition"
                          error={
                            formik.touched.conditions &&
                            Boolean(formik.errors.conditions)
                          }
                          helperText={
                            formik.touched.conditions &&
                            formik.errors.conditions
                          }
                        />
                      )}
                      value={formik.values.branch3Condition || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch3Condition", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch3Value"
                      disableClearable
                      options={emailListRecordsByListId}
                      getOptionLabel={(option) => getFirstOptionLabel(option)}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 3 Value"
                          error={
                            formik.touched.value && Boolean(formik.errors.value)
                          }
                          helperText={
                            formik.touched.value && formik.errors.value
                          }
                        />
                      )}
                      value={formik.values.branch3Value || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch3Value", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <Box
                    sx={{
                      // width: 350,
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        enqueueSnackbar(`Form Updated Successfully`, {
                          variant: "success",
                        });
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        formik.setFieldValue("branch3List", null);
                        formik.setFieldValue("branch3Column", null);
                        formik.setFieldValue("branch3Condition", null);
                        formik.setFieldValue("branch3Value", null);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Clear
                    </Button>
                  </Box>
                </>
              </Box>
            )}
            {index === 3 && (
              <Box>
                <>
                  <div>
                    <Autocomplete
                      id="branch4List"
                      name="branch4List"
                      options={listOptions}
                      value={formik.values.branch4List || null}
                      getOptionLabel={(option) =>
                        `${option.list_name} (${option.records})`
                      }
                      onChange={(e, newValue) => {
                        setvalue({ id: newValue.listid });
                        formik.setFieldValue("branch4List", newValue);
                        formik.setFieldValue("branch4Column", null);
                        formik.setFieldValue("branch4Value", null);
                        setEmailListRecordsByListId([]);
                      }}
                      renderInput={(params) => (
                        <TextField
                          error={
                            formik.touched.list && Boolean(formik.errors.list)
                          }
                          helperText={formik.touched.list && formik.errors.list}
                          {...params}
                          label="Branch 4 List"
                          variant="standard"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch4Column"
                      disableClearable
                      options={segmentListFields}
                      getOptionLabel={(option) => option?.name}
                      value={formik.values.branch4Column || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch4Column", newValue, true);
                        formik.setFieldValue("branch4Value", "");
                        if (formik.values.branch4List) {
                          getEmailListRecords(newValue.name);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 4 Column"
                          error={
                            formik.touched.column &&
                            Boolean(formik.errors.column)
                          }
                          helperText={
                            formik.touched.column && formik.errors.column
                          }
                        />
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch4Condition"
                      disableClearable
                      options={getOperators}
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 4 Condition"
                          error={
                            formik.touched.conditions &&
                            Boolean(formik.errors.conditions)
                          }
                          helperText={
                            formik.touched.conditions &&
                            formik.errors.conditions
                          }
                        />
                      )}
                      value={formik.values.branch4Condition || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch4Condition", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch4Value"
                      disableClearable
                      options={emailListRecordsByListId}
                      getOptionLabel={(option) => getFirstOptionLabel(option)}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 4 Value"
                          error={
                            formik.touched.value && Boolean(formik.errors.value)
                          }
                          helperText={
                            formik.touched.value && formik.errors.value
                          }
                        />
                      )}
                      value={formik.values.branch4Value || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch4Value", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <Box
                    sx={{
                      // width: 350,
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        enqueueSnackbar(`Form Updated Successfully`, {
                          variant: "success",
                        });
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        formik.setFieldValue("branch4List", null);
                        formik.setFieldValue("branch4Column", null);
                        formik.setFieldValue("branch4Condition", null);
                        formik.setFieldValue("branch4Value", null);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Clear
                    </Button>
                  </Box>
                </>
              </Box>
            )}
            {index === 4 && (
              <Box>
                <>
                  <div>
                    <Autocomplete
                      id="branch5List"
                      name="branch5List"
                      options={listOptions}
                      value={formik.values.branch5List || null}
                      getOptionLabel={(option) =>
                        `${option.list_name} (${option.records})`
                      }
                      onChange={(e, newValue) => {
                        setvalue({ id: newValue.listid });
                        formik.setFieldValue("branch5List", newValue);
                        formik.setFieldValue("branch5Column", null);
                        formik.setFieldValue("branch5Value", null);
                        setEmailListRecordsByListId([]);
                      }}
                      renderInput={(params) => (
                        <TextField
                          error={
                            formik.touched.list && Boolean(formik.errors.list)
                          }
                          helperText={formik.touched.list && formik.errors.list}
                          {...params}
                          label="Branch 5 List"
                          variant="standard"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch5Column"
                      disableClearable
                      options={segmentListFields}
                      getOptionLabel={(option) => option?.name}
                      value={formik.values.branch5Column || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch5Column", newValue, true);
                        formik.setFieldValue("branch5Value", "");
                        if (formik.values.branch5List) {
                          getEmailListRecords(newValue.name);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 5 Column"
                          error={
                            formik.touched.column &&
                            Boolean(formik.errors.column)
                          }
                          helperText={
                            formik.touched.column && formik.errors.column
                          }
                        />
                      )}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch5Condition"
                      disableClearable
                      options={getOperators}
                      getOptionLabel={(option) => option?.label}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 5 Condition"
                          error={
                            formik.touched.conditions &&
                            Boolean(formik.errors.conditions)
                          }
                          helperText={
                            formik.touched.conditions &&
                            formik.errors.conditions
                          }
                        />
                      )}
                      value={formik.values.branch5Condition || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch5Condition", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div>
                    <Autocomplete
                      id="branch5Value"
                      disableClearable
                      options={emailListRecordsByListId}
                      getOptionLabel={(option) => getFirstOptionLabel(option)}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          label="Branch 5 Value"
                          error={
                            formik.touched.value && Boolean(formik.errors.value)
                          }
                          helperText={
                            formik.touched.value && formik.errors.value
                          }
                        />
                      )}
                      value={formik.values.branch5Value || null}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("branch5Value", newValue);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <Box
                    sx={{
                      // width: 350,
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        enqueueSnackbar(`Form Updated Successfully`, {
                          variant: "success",
                        });
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        formik.setFieldValue("branch5List", null);
                        formik.setFieldValue("branch5Column", null);
                        formik.setFieldValue("branch5Condition", null);
                        formik.setFieldValue("branch5Value", null);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Clear
                    </Button>
                  </Box>
                </>
              </Box>
            )}
          </Box>
        </Drawer>
      </form>
    </Box>
  );
};
