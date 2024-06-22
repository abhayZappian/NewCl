import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import FormComponent from "./FormComponent";
import { useFormik } from "formik";
import schema from "./validationSchema";
import {
  addNetwork,
  getNetworkList,
  getNetworkName,
  updateNetwork,
} from "services/creativeCompliance/networkCompliance";

const NetworkDrawer = ({ defaultValues, open, setOpen, getDataRender }) => {
  const [networkDetails, setNetworkDetails] = useState([]);
  const defaultValueslength = Object.keys(defaultValues).length;

  const formik = useFormik({
    initialValues: {
      networkId: null,
      networkDetails: null,
      networkName: "",
      // from name
      fromName: [],
      fromNameDate: null,
      fromNameCheckBox: false,
      // subject line
      subjectLine: [],
      subjectLineDate: null,
      subjectLineCheckBox: false,
      // restrictedWord
      restrictedWord: [],
      restrictedWordDate: null,
      restrictedWordCheckBox: false,
      // warning Word
      warningWord: [],
      warningWordDate: null,
      warningWordCheckBox: false,
      // seasonal From Name
      seasonalFromName: [],
      seasonalFromNameDate: null,
      seasonalFromNameCheckBox: false,
      // seasonal Subject Line
      seasonalSubjectLine: [],
      seasonalSubjectLineDate: null,
      seasonalSubjectLineCheckBox: false,
      // Spam Words
      spamWord: [],
      spamWordDate: null,
      spamWordCheckBox: false,
      // Footer
      footer: [],
      footerDate: null,
      footerCheckBox: false,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const filteredValues = {
        ...values,
        networkId: values.networkDetails.lable,
        networkName: values.networkDetails.value,
        subjectLine: values.subjectLine
          .map((line) => line.trim())
          .filter((line) => line !== ""),
        fromName: values.fromName
          .map((name) => name.trim())
          .filter((name) => name !== ""),
        restrictedWord: values.restrictedWord
          .map((word) => word.trim())
          .filter((word) => word !== ""),
        warningWord: values.warningWord
          .map((word) => word.trim())
          .filter((word) => word !== ""),
        seasonalFromName: values.seasonalFromName
          .map((name) => name.trim())
          .filter((name) => name !== ""),
        seasonalSubjectLine: values.seasonalSubjectLine
          .map((line) => line.trim())
          .filter((line) => line !== ""),
        spamWord: values.spamWord
          .map((word) => word.trim())
          .filter((word) => word !== ""),
        footer: values.footer.map((name) => name.trim()).join("\n"),
        // .filter((name) => name !== ""),
      };
      // Remove checkboxes from filteredValues
      for (const key in filteredValues) {
        if (key.endsWith("CheckBox")) {
          delete filteredValues[key];
        }
      }
      delete filteredValues["networkDetails"];
      if (defaultValueslength === 0) {
        addNetworkDetails(filteredValues);
      } else {
        updateNetworkDetails(filteredValues, defaultValues?._id);
      }
    },
  });
  const addNetworkDetails = async (data) => {
    try {
      await addNetwork(data);
      setOpen(false);
      getDataRender();
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const updateNetworkDetails = async (data, id) => {
    // debugger;
    try {
      await updateNetwork(data, id);
      setOpen(false);
      getDataRender();
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // updateNetworkDetails
  const isDisable = () => {
    const isFromNameValid =
      formik.values.fromName.length &&
      formik.values.fromName[0] !== "" &&
      formik.values.fromNameDate !== null;
    const isSubjectLineValid =
      formik.values.subjectLine.length &&
      formik.values.subjectLine[0] !== "" &&
      formik.values.subjectLineDate !== null;
    const isRestrictedWordValid =
      formik.values.restrictedWord.length &&
      formik.values.restrictedWord[0] !== "" &&
      formik.values.restrictedWordDate !== null;
    const isWarningWordValid =
      formik.values.warningWord.length &&
      formik.values.warningWord[0] !== "" &&
      formik.values.warningWordDate !== null;
    const isSeasonalFromNameValid =
      formik?.values?.seasonalFromName?.length &&
      formik?.values?.seasonalFromName[0] !== "" &&
      formik?.values?.seasonalFromNameDate !== null;
    const isSeasonalSubjectLineValid =
      formik.values.seasonalSubjectLine.length &&
      formik.values.seasonalSubjectLine[0] !== "" &&
      formik.values.seasonalSubjectLineDate !== null;
    const isSpamWordValid =
      formik?.values?.spamWord?.length &&
      formik?.values?.spamWord[0] !== "" &&
      formik?.values?.spamWordDate !== null;
    const isFooterValid =
      formik.values.footer.length &&
      formik.values.footer[0] !== "" &&
      formik.values.footerDate !== null;
    return !(
      isFromNameValid ||
      isSubjectLineValid ||
      isRestrictedWordValid ||
      isWarningWordValid ||
      isSeasonalFromNameValid ||
      isSeasonalSubjectLineValid ||
      isSpamWordValid ||
      isFooterValid
    );
  };
  const getNetworkListDetail = async () => {
    try {
      const { data } = await getNetworkName();
      setNetworkDetails(data);
    } catch (error) {}
  };
  useEffect(() => {
    isDisable();
  }, [formik.values]);
  useEffect(() => {
    getNetworkListDetail();
  }, []);
  const setFieldValues = (values) => {
    console.log(values, "vvvvv");
    formik.setFieldValue("fromName", defaultValues?.fromName);
    formik.setFieldValue("fromNameDate", defaultValues?.fromNameDate);
    //
    formik.setFieldValue("subjectLine", defaultValues?.subjectLine);
    formik.setFieldValue("subjectLineDate", defaultValues?.subjectLineDate);
    //
    formik.setFieldValue("restrictedWord", defaultValues?.restrictedWord);
    formik.setFieldValue(
      "restrictedWordDate",
      defaultValues?.restrictedWordDate
    );
    //
    formik.setFieldValue("warningWord", defaultValues?.warningWord);
    formik.setFieldValue("warningWordDate", defaultValues?.warningWordDate);
    //
    formik.setFieldValue("seasonalFromName", defaultValues?.seasonalFromName);
    formik.setFieldValue(
      "seasonalFromNameDate",
      defaultValues?.seasonalFromNameDate
    );
    //
    formik.setFieldValue(
      "seasonalSubjectLine",
      defaultValues?.seasonalSubjectLine
    );
    formik.setFieldValue(
      "seasonalSubjectLineDate",
      defaultValues?.seasonalSubjectLineDate
    );
    //
    formik.setFieldValue("spamWord", defaultValues?.spamWord);
    formik.setFieldValue("spamWordDate", defaultValues?.spamWordDate);
    //
    formik.setFieldValue("footer", [defaultValues?.footer]);
    formik.setFieldValue("footerDate", defaultValues?.footerDate);
    //
    formik.setFieldValue("networkDetails", {
      lable: defaultValues.networkId,
      value: defaultValues.networkName,
    });
    // setTimeout(() => {
    //   formik.validateField("list_name");
    //   formik.validateField("countryId");
    // }, 0);
  };

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    } else {
      formik.setFieldValue();
    }
  }, [defaultValues]);
  console.log(defaultValues, "defaultValuesdefaultValuesdefaultValues");
  return (
    <Drawer anchor="right" open={open}>
      <Typography ml={4} my={4} variant="h2">
        Add Network Compliance
      </Typography>
      <form style={{ width: "80vw" }} onSubmit={formik.handleSubmit}>
        <Autocomplete
          sx={{ width: "80%", mb: "20px", ml: 4 }}
          id="networkDetails"
          name="networkDetails"
          required
          size="small"
          options={networkDetails}
          value={formik.values.networkDetails}
          getOptionLabel={(option) => `${option.value}`}
          onBlur={formik.handleBlur}
          onChange={(e, newValue) => {
            formik.setFieldValue("networkDetails", newValue);
          }}
          renderInput={(params) => (
            <TextField
              label="Select Network Name"
              variant="outlined"
              {...params}
              error={
                formik.touched.networkDetails &&
                Boolean(formik.errors.networkDetails)
              }
              helperText={
                formik.touched.networkDetails && formik.errors.networkDetails
              }
            />
          )}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <FormComponent
              formik={formik}
              label="From Name"
              checkboxName="fromName"
              dateFieldName="fromNameDate"
              textFieldName="fromName"
            />
            <FormComponent
              formik={formik}
              label="Subject Line"
              checkboxName="subjectLine"
              dateFieldName="subjectLineDate"
              textFieldName="subjectLine"
            />
            <FormComponent
              formik={formik}
              label="Restricted Word"
              checkboxName="restrictedWord"
              dateFieldName="restrictedWordDate"
              textFieldName="restrictedWord"
            />
            <FormComponent
              formik={formik}
              label="Warning Word"
              checkboxName="warningWord"
              dateFieldName="warningWordDate"
              textFieldName="warningWord"
            />
          </Box>
          <Box sx={{ width: "50%" }}>
            <FormComponent
              formik={formik}
              label="Seasonal From Name"
              checkboxName="seasonalFromName"
              dateFieldName="seasonalFromNameDate"
              textFieldName="seasonalFromName"
            />
            <FormComponent
              formik={formik}
              label="Seasonal Subject Line"
              checkboxName="seasonalSubjectLine"
              dateFieldName="seasonalSubjectLineDate"
              textFieldName="seasonalSubjectLine"
            />
            <FormComponent
              formik={formik}
              label="Spam Word"
              checkboxName="spamWord"
              dateFieldName="spamWordDate"
              textFieldName="spamWord"
            />
            {/* FOOTER SPECIAL TREATMENT */}
            <FormComponent
              formik={formik}
              label="Footer"
              checkboxName="footer"
              dateFieldName="footerDate"
              textFieldName="footer"
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            mt: 2,
            mb: 2,
          }}
        >
          <Button
            // fullWidth
            disabled={isDisable()}
            variant="contained"
            type="submit"
            sx={{
              color: "#white",
              textTransform: "capitalize",
              width: "30%",
            }}
          >
            submit
          </Button>
          <Button
            // fullWidth
            variant="outlined"
            sx={{
              border: "1px solid #9B9B9B",
              color: "#2F2F33",
              textTransform: "capitalize",
              width: "30%",
            }}
            onClick={() => {
              formik.resetForm();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Drawer>
  );
};
export default NetworkDrawer;
