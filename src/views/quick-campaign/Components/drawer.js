import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import Icon from "@mdi/react";
import { mdiInformationOutline } from "@mdi/js";
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AceEditor from "react-ace";
import ReactDOM from "react-dom";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-spellcheck";
import "ace-builds/webpack-resolver";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  getEmailTags,
  getListData,
  getOfferList,
  getSegmentsWithListId,
  getTimeZone,
} from "services/common";
import { createdByName, createdBy } from "../../../helpers/userInfo";

import { getESAdetails, getESPdetails } from "services/presets/pool";
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import { getSuppresion } from "services/dataManagement/supression";
import {
  createQuickJourney,
  getSendTestEmail,
  updateQuickJourney,
} from "services/quickCampaign";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import PreviewForm from "./PreviewForm";
import { validationSchema, validationSchemaTest } from "./schema";
import { templateAllDetail } from "services/presets/template";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const QuickCampaignDrawer = ({
  defaultValues,
  setDefaultValues,
  isDrawerOpen,
  setIsDrawerOpen,
  getDataRender,
}) => {
  const aceEditorRef = useRef();
  const [listData, setlistData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [espList, setEspList] = useState([]);
  const [espAccontList, setEspAccontList] = useState([]);
  const [timeZoneLists, setTimeZoneLists] = useState([]);
  const [offerDetailsLink, setOfferDetailsLink] = useState({
    offer: "",
    personalUnSub: "",
    networkUnsub: "",
  });
  const [emailTags, setEmailTags] = useState([]);
  const [suppressionList, setsuppressionList] = useState([]);
  const [finalSchema, setFinalSchema] = useState(validationSchema);
  const [sentMail, setSentMail] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [valuesArray, setValuesArray] = useState([]);
  const [emailHeader, setEmailheader] = useState([]);
  const [nameChange, setNameChange] = useState("Schedule Now");
  console.log(defaultValues, "values");

  const [templateDetails, setTemplateDetails] = useState([]);
  console.log(templateDetails, "templateDetails");

  const getData = async () => {
    const data = await templateAllDetail();
    setTemplateDetails(data?.result);
  };

  const defaultValueslength = Object.keys(defaultValues).length;

  const createArray = () => {
    const newArray = inputValue.split("\n");
    const filteredArray = newArray.filter((value) => value.trim() !== "");
    setValuesArray((prevArray) => [...prevArray, ...filteredArray]);
    setInputValue("");
  };
  const handleValidateSchema = (data) => {
    // debugger;
    if (data === "test") {
      setFinalSchema(validationSchemaTest);
    } else if (data === "campaignSubmit") {
      setFinalSchema(validationSchema);
    }
  };

  const onEditorChange = (newValue) => {
    formik.setFieldValue("htmlCode", newValue);
  };
  const parsedTime = dayjs(`2022-04-17T${""}`);

  // console.log(defaultValues, "defaultValues")
  const formik = useFormik({
    initialValues: {
      acknowledgmentEmail: "",
      acknowledgmentAfterCount: "",
      campaignName: "",
      offerId: null,
      s1: "",
      s2: "",
      s3: "",
      offerLink: "",
      offerLinkCheckbox: false,
      personalUnsub: "",
      personalUnsubLinkCheckbox: false,
      networkUnsub: "",
      networkUnsubLinkCheckbox: false,
      emailServiceType: "esp",
      smtpEmailServiceAccount: "",
      espName: "",
      emailServiceAccount: "",
      groupSmtpServerName: "",
      groupSmtpList: "",
      fromName: "",
      subjectLine: "",
      fromDomain: "",
      fromEmailName: "",
      replyTo: "",
      emailHeader: "",
      listId: [],
      segmentData: [],
      suppressionListId: [],
      rangeFrom: "",
      rangeTo: "",
      maxCount: "",
      enrichData: {
        open: "",
        click: "",
        unsub: "",
      },
      breakActionCount: "",
      breakActionTime: "",
      emails: "",
      timezone: "",
      scheduleType: "schedulNow",
      scheduleDate: "",
      scheduleStartTime: parsedTime.isValid() ? parsedTime.toDate() : null,
      templateText: "",
      htmlCode: "",
      isSchedule: true,
      description: "description",
    },
    validationSchema: finalSchema,
    onSubmit: async (values) => {
      // debugger
      if (sentMail === true) {
        const data = {
          offerId: values.offerId,
          espName: values.espName,
          emailServiceAccount: values.emailServiceAccount,
          // templateList: values.templateList,
          subID1: values.subID1,
          subID2: values.subID2,
          subID3: values.subID3,
          fromName: values.fromName.trim(),
          subjectLine: values.subjectLine,
          fromDomain: values.fromDomain,
          fromEmailName: values.fromEmailName,
          replyTo: values.replyTo,
          emailHeader: values.emailHeader,
          suppression: values.suppression,
          emails: valuesArray || null,
          // sendEmailType: values.sendEmailType,
          templateList: {
            templateHtml: values.templateHtml,
            templateText: values.templateText,
          },
          emailType: "quick",
        };
        await getSendTestEmail(data);
      } else {
        const created_by = createdBy;
        const created_by_name = createdByName;
        if (defaultValueslength === 0) {
          const res = await createQuickJourney({
            ...values,
            created_by_name,
            created_by,
          });
          if (res.code === 200) {
            setIsDrawerOpen(false);
            formik.resetForm();
            getDataRender();
          }
        } else {
          const res = await updateQuickJourney(
            { ...values, created_by_name, created_by },
            defaultValues._id
          );
          if (res.code === 200) {
            setIsDrawerOpen(false);
            setDefaultValues({});
            formik.resetForm();
            getDataRender();
          }
        }
      }
    },
  });
  const getSegmentsData = async (listId, list_name) => {
    try {
      // debugger
      // Check if segment data for listId already exists
      const existingSegment = formik.values.segmentData.find(
        (segment) => segment.listId === listId
      );
      if (existingSegment) {
        console.log(`Segment data for listId ${listId} already exists.`);
        return;
      } else {
        const data = await getSegmentsWithListId(listId);
        // Check if data is not empty
        if (data) {
          const modifiedData = data.map((item) => ({ ...item, type: "none" }));
          const currentData = formik.values.segmentData || [];
          const updatedData = [
            ...currentData,
            { listId, list_name, data: modifiedData },
          ];
          formik.setFieldValue("segmentData", updatedData);
        } else {
          console.error(`No data returned for listId ${listId}.`);
        }
      }
    } catch (error) {
      console.error(`Error fetching segment data for listId ${listId}:`, error);
      // Handle error accordingly, such as showing an error message to the user
    }
  };
  const getEmailHeader = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.getHeaderNames);
    setEmailheader(data?.result);
    // dispatch(setSuppressionData(data));
  };
  const getLists = async () => {
    const data = await getListData();
    setlistData(data);
  };
  const getOffers = async () => {
    const data = await getOfferList();
    setOfferData(data);
  };
  const getEspList = async () => {
    const { data } = await getESPdetails();
    setEspList(data);
  };
  const getEmailServiceAccount = async (id) => {
    const { data } = await getESAdetails(id);
    setEspAccontList(data);
  };
  const getTimeZoneList = async () => {
    const data = await getTimeZone();
    setTimeZoneLists(data);
  };
  function removeStyleTag(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var styleTags = doc.querySelectorAll("style");
    styleTags.forEach(function (styleTag) {
      styleTag.parentNode.removeChild(styleTag);
    });

    return doc?.documentElement?.innerHTML?.replace(/<\/?[^>]+(>|$)/g, "");
  }
  const removeNewlines = (inputString) => {
    return inputString?.replace(/\n/g, "");
  };
  const getEmailTag = async () => {
    const data = await getEmailTags();
    setEmailTags(data);
  };
  const getSuppressionData = async () => {
    const data = await getSuppresion();
    setsuppressionList(data);
  };
  useEffect(() => {
    getData();
    getLists();
    getOffers();
    getEspList();
    getEmailTag();
    getTimeZoneList();
    getSuppressionData();
    getEmailHeader();
  }, []);

  useEffect(() => {
    formik.values.listId.forEach((selectedItem) => {
      getSegmentsData(selectedItem.listid, selectedItem.list_name);
    });
    // Remove segmentData corresponding to removed listId
    const existingListIds = formik.values.listId.map((item) => item.listid);
    const updatedSegnmentData = formik.values.segmentData.filter((segment) =>
      existingListIds.includes(segment.listId)
    );
    formik.setFieldValue("segmentData", updatedSegnmentData);
  }, [formik.values.listId]);

  useEffect(() => {
    if (formik.values.espName.esp_id) {
      getEmailServiceAccount(formik.values.espName.esp_id);
    }
  }, [formik.values.espName]);
  useEffect(() => {
    if (formik.values?.htmlCode) {
      const cleanedHtmlCode = removeNewlines(formik?.values?.htmlCode);
      formik.setFieldValue("templateHtml", cleanedHtmlCode);
      formik.setFieldValue(
        "templateText",
        removeStyleTag(formik.values.htmlCode)
        // formik?.values?.htmlCode?.replace(/<\/?[^>]+(>|$)/g, "")
      );
    }
  }, [formik.values?.htmlCode]);
  useEffect(() => {
    // setReceivedData(defaultValues);
    if (defaultValues !== undefined && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);
  const fetchEmailDomainName = async (esp_account_id, esp) => {
    try {
      const response = await axiosInstance.get(
        `${apiEndPoints?.getDomainByESP}/${esp_account_id}/${esp}`
      );
      const data = response.data;
      formik.setFieldValue("fromDomain", data[0]?.fromDomain);
      formik.setFieldValue("replyTo", data[0]?.replyTo);
      // setEmailServiceAccountOptions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const setFieldValues = (values) => {
    console.log(values?.journeyName, "values");
    // debugger
    formik.setFieldValue("campaignName", values?.journeyName);
    formik.setFieldValue("offerId", values?.storeData?.offerId);
    formik.setFieldValue("s1", values?.storeData?.s1);
    formik.setFieldValue("s2", values?.storeData?.s2);
    formik.setFieldValue("s3", values?.storeData?.s3);
    formik.setFieldValue("offerLink", values?.storeData?.offerLink);
    formik.setFieldValue(
      "offerLinkCheckbox",
      values?.storeData?.offerLinkCheckbox
    );
    formik.setFieldValue("personalUnsub", values?.storeData?.personalUnsub);
    formik.setFieldValue(
      "personalUnsubLinkCheckbox",
      values?.storeData?.personalUnsubLinkCheckbox
    );
    formik.setFieldValue("networkUnsub", values?.storeData?.networkUnsub);
    formik.setFieldValue(
      "networkUnsubLinkCheckbox",
      values?.storeData?.networkUnsubLinkCheckbox
    );
    formik.setFieldValue(
      "emailServiceType",
      values?.storeData?.emailServiceType
    );
    formik.setFieldValue(
      "smtpEmailServiceAccount",
      values?.storeData?.smtpEmailServiceAccount
    );
    formik.setFieldValue("espName", values?.storeData?.espName);
    formik.setFieldValue(
      "emailServiceAccount",
      values?.storeData?.emailServiceAccount
    );
    formik.setFieldValue("fromName", values?.storeData?.fromName);
    formik.setFieldValue("subjectLine", values?.storeData?.subjectLine);
    formik.setFieldValue("fromDomain", values?.storeData?.fromDomain);
    formik.setFieldValue("fromEmailName", values?.storeData?.fromEmailName);
    formik.setFieldValue("replyTo", values?.storeData?.replyTo);
    formik.setFieldValue("emailHeader", values?.storeData?.emailHeader);
    formik.setFieldValue("listId", values?.storeData?.listId);
    formik.setFieldValue("segmentData", values?.storeData?.segmentData);
    formik.setFieldValue(
      "suppressionListId",
      values?.storeData?.suppressionListId
    );
    formik.setFieldValue("rangeFrom", values?.storeData?.rangeFrom);
    formik.setFieldValue("rangeTo", values?.storeData?.rangeTo);
    formik.setFieldValue("maxCount", values?.storeData?.maxCount);
    formik.setFieldValue(
      "enrichData.open",
      values?.storeData?.enrichData?.open
    );
    formik.setFieldValue(
      "enrichData.click",
      values?.storeData?.enrichData?.click
    );
    formik.setFieldValue(
      "enrichData.unsub",
      values?.storeData?.enrichData?.unsub
    );
    formik.setFieldValue(
      "breakActionCount",
      values?.storeData?.breakActionCount
    );
    formik.setFieldValue("breakActionTime", values?.storeData?.breakActionTime);
    formik.setFieldValue("emails", values?.storeData?.emails);
    formik.setFieldValue("timezone", values?.storeData?.timezone);
    formik.setFieldValue("scheduleType", values?.storeData?.scheduleType);
    formik.setFieldValue("scheduleDate", values?.storeData?.scheduleDate);
    // debugger;
    formik.setFieldValue(
      "scheduleStartTime",
      values?.storeData?.scheduleStartTime,
      true
    );
    formik.setFieldValue("templateText", values?.storeData?.templateText);
    formik.setFieldValue("htmlCode", values?.storeData?.htmlCode);
    formik.setFieldValue("isSchedule", values?.storeData?.isSchedule);
    formik.setFieldValue("description", values?.storeData?.description);
    formik.setFieldValue("templateHtml", values?.storeData?.templateHtml);
    formik.validateField("scheduleDate");
    setTimeout(() => {
      formik.validateField("scheduleStartTime");
    }, 0);
  };
  return (
    <>
      <Drawer anchor="right" open={isDrawerOpen}>
        {/* <Box
          sx={{ m: 1, width: "350px", margin: "24px" }}
          noValidate
          autoComplete="off"
        ></Box> */}
        <div>
          <Box
            sx={{
              width: "100%",
              borderBottom: "1px solid #c2c2c2",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontWeight: 900, padding: "20px 0px", pl: 3, pr: 1 }}
              variant="h2"
            >
              Add Quick Email Campaign
            </Typography>
            <Icon
              style={{ color: "grey" }}
              path={mdiInformationOutline}
              size={1}
            />
          </Box>
          <Box sx={{ padding: "0px 20px" }}>
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                      pt: "25px",
                    }}
                  >
                    <Grid item>
                      <TextField
                        sx={{ width: "18vw", height: "75px" }}
                        id="campaignName"
                        name="campaignName"
                        label="Campaign Name *"
                        size="small"
                        value={formik.values.campaignName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.campaignName &&
                          Boolean(formik.errors.campaignName)
                        }
                        helperText={
                          formik.touched.campaignName &&
                          formik.errors.campaignName
                        }
                      />
                    </Grid>
                    <Grid item>
                      <Autocomplete
                        sx={{ width: "18vw", height: "75px" }}
                        id="offerId"
                        disableClearable
                        name="offerId"
                        options={offerData}
                        getOptionLabel={(option) => option.offer_name}
                        size="small"
                        value={formik.values.offerId || null}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("offerId", newValue, false);
                          setTimeout(() => {
                            formik.validateField("offerId");
                          }, 0);
                          setOfferDetailsLink({
                            offer: newValue.offer_link,
                            personalUnsub: newValue.personal_unsub,
                            networkUnsub: newValue.network_unsub,
                          });
                          formik.setFieldValue(
                            "offerLink",
                            newValue.offer_link
                          );
                          formik.setFieldValue(
                            "personalUnsub",
                            newValue.personal_unsub
                          );
                          formik.setFieldValue(
                            "networkUnsub",
                            newValue.network_unsub
                          );
                        }}
                        onBlur={formik.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            error={
                              formik.touched.offerId &&
                              Boolean(formik.errors.offerId)
                            }
                            helperText={
                              formik.touched.offerId && formik.errors.offerId
                            }
                            {...params}
                            label="Offer Id *"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: "18vw", height: "75px" }}
                        id="s1"
                        name="s1"
                        label="Sub ID 1 "
                        size="small"
                        value={formik.values.s1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.s1 && Boolean(formik.errors.s1)}
                        helperText={formik.touched.s1 && formik.errors.s1}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: "18vw", height: "75px" }}
                        id="s2"
                        name="s2"
                        label="Sub ID 2 "
                        size="small"
                        value={formik.values.s2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.s2 && Boolean(formik.errors.s2)}
                        helperText={formik.touched.s2 && formik.errors.s2}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: "18vw", height: "75px" }}
                        id="s3"
                        name="s3"
                        label="Sub ID 3 "
                        size="small"
                        value={formik.values.s3}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.s3 && Boolean(formik.errors.s3)}
                        helperText={formik.touched.s3 && formik.errors.s3}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              {/* ////// box 2 */}
              <Box
                sx={{
                  width: "100%",

                  mt: 3,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <TextField
                        sx={{ width: "50vw" }}
                        id="offerLink"
                        name="offerLink"
                        label="Offer Link *"
                        size="small"
                        disabled={!formik.values.offerLinkCheckbox}
                        value={
                          formik.values.offerLink
                          // || offerDetailsLink.offer
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.offerLink &&
                          Boolean(formik.errors.offerLink)
                        }
                        helperText={
                          formik.touched.offerLink && formik.errors.offerLink
                        }
                      />
                      <FormGroup sx={{ ml: "20px" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.offerLinkCheckbox}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "offerLinkCheckbox",
                                  e.target.checked
                                );
                                formik.setFieldValue("offerLink", "");
                                if (formik.values.offerLinkCheckbox) {
                                  formik.setFieldValue(
                                    "offerLink",
                                    offerDetailsLink.offer
                                  );
                                }
                              }}
                            />
                          }
                          label="New"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        pt: "25px",
                      }}
                      item
                    >
                      <TextField
                        sx={{ width: "50vw" }}
                        id="personalUnsub"
                        name="personalUnsub"
                        label="Personal Unsub Link "
                        size="small"
                        disabled={!formik.values.personalUnsubLinkCheckbox}
                        value={formik.values.personalUnsub}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.personalUnsub &&
                          Boolean(formik.errors.personalUnsub)
                        }
                        helperText={
                          formik.touched.personalUnsub &&
                          formik.errors.personalUnsub
                        }
                      />
                      <FormGroup sx={{ ml: "20px" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.personalUnsubLinkCheckbox}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "personalUnsubLinkCheckbox",
                                  e.target.checked
                                );
                                formik.setFieldValue("personalUnsub", "");
                                if (formik.values.personalUnsubLinkCheckbox) {
                                  // debugger
                                  formik.setFieldValue(
                                    "personalUnsub",
                                    offerDetailsLink.personalUnsub
                                  );
                                }
                              }}
                            />
                          }
                          label="New"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        pt: "25px",
                      }}
                      item
                    >
                      <TextField
                        sx={{ width: "50vw" }}
                        id="networkUnsub"
                        size="small"
                        name="networkUnsub"
                        label="Network Unsub Link "
                        disabled={!formik.values.networkUnsubLinkCheckbox}
                        value={formik.values.networkUnsub}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.networkUnsub &&
                          Boolean(formik.errors.networkUnsub)
                        }
                        helperText={
                          formik.touched.networkUnsub &&
                          formik.errors.networkUnsub
                        }
                      />
                      <FormGroup sx={{ ml: "20px" }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formik.values.networkUnsubLinkCheckbox}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "networkUnsubLinkCheckbox",
                                  e.target.checked
                                );
                                formik.setFieldValue("networkUnsub", "");
                                if (formik.values.networkUnsubLinkCheckbox) {
                                  formik.setFieldValue(
                                    "networkUnsub",
                                    offerDetailsLink.networkUnsub
                                  );
                                }
                              }}
                            />
                          }
                          label="New"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              {/* //// box3 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 3,
                }}
              >
                <Grid>
                  <Grid
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Paper
                      elevation={3}
                      style={{ borderRadius: 10, padding: 20 }}
                    >
                      <Typography sx={{ mb: 1 }} variant="h4">
                        Email Service Type *
                      </Typography>
                      <RadioGroup
                        row
                        name="emailServiceType"
                        value={formik.values.emailServiceType}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel
                          labelPlacement="start"
                          value="smtp"
                          control={<Radio />}
                          label="SMTP"
                        />
                        <FormControlLabel
                          labelPlacement="start"
                          value="esp"
                          control={<Radio />}
                          label="ESP"
                        />
                        <FormControlLabel
                          labelPlacement="start"
                          value="groupSMTP"
                          control={<Radio />}
                          label="Group SMTP"
                        />
                      </RadioGroup>
                      {formik.touched.emailServiceType &&
                      formik.errors.emailServiceType ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.emailServiceType}
                        </div>
                      ) : null}
                      {formik.values.emailServiceType === "smtp" && (
                        <Grid sx={{ mt: 2 }}>
                          <Autocomplete
                            sx={{ width: "18vw", height: "75px" }}
                            id="smtpEmailServiceAccount"
                            disableClearable
                            name="smtpEmailServiceAccount"
                            options={[]}
                            size="small"
                            value={
                              formik?.values?.smtpEmailServiceAccount || null
                            }
                            onChange={(event, newValue) => {
                              formik.setFieldValue(
                                "smtpEmailServiceAccount",
                                newValue
                              );
                            }}
                            onBlur={formik.handleBlur}
                            renderInput={(params) => (
                              <TextField
                                error={
                                  formik.touched.smtpEmailServiceAccount &&
                                  Boolean(formik.errors.smtpEmailServiceAccount)
                                }
                                helperText={
                                  formik.touched.smtpEmailServiceAccount &&
                                  formik.errors.smtpEmailServiceAccount
                                }
                                {...params}
                                label="Email Service Account *"
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {formik.values.emailServiceType === "esp" && (
                        <Grid sx={{ mt: 2, display: "flex", gap: "30px" }}>
                          <Autocomplete
                            sx={{ width: "18vw", height: "75px" }}
                            id="espName"
                            disableClearable
                            name="espName"
                            options={espList}
                            getOptionLabel={(option) => option.esp_name}
                            size="small"
                            value={formik.values.espName || null}
                            onChange={(event, newValue) => {
                              formik.setFieldValue("espName", newValue);
                              formik.setFieldValue("emailServiceAccount", "");
                            }}
                            onBlur={formik.handleBlur}
                            renderInput={(params) => (
                              <TextField
                                error={
                                  formik.touched.espName &&
                                  Boolean(formik.errors.espName)
                                }
                                helperText={
                                  formik.touched.espName &&
                                  formik.errors.espName
                                }
                                {...params}
                                label="ESP Name *"
                              />
                            )}
                          />
                          <Autocomplete
                            sx={{ width: "18vw", height: "75px" }}
                            id="emailServiceAccount"
                            disableClearable
                            name="emailServiceAccount"
                            options={espAccontList}
                            getOptionLabel={(option) => option.account_name}
                            size="small"
                            value={formik.values.emailServiceAccount || null}
                            onChange={(event, newValue) => {
                              formik.setFieldValue(
                                "emailServiceAccount",
                                newValue
                              );
                              fetchEmailDomainName(
                                newValue?.esp_account_id,
                                "esp"
                              );
                            }}
                            onBlur={formik.handleBlur}
                            renderInput={(params) => (
                              <TextField
                                error={
                                  formik.touched.emailServiceAccount &&
                                  Boolean(formik.errors.emailServiceAccount)
                                }
                                helperText={
                                  formik.touched.emailServiceAccount &&
                                  formik.errors.emailServiceAccount
                                }
                                {...params}
                                label="Email Service Account *"
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {formik.values.emailServiceType === "groupSMTP" && (
                        <Grid sx={{ mt: 2, display: "flex", gap: "30px" }}>
                          <Autocomplete
                            sx={{ width: "18vw", height: "75px" }}
                            id="groupSmtpServerName"
                            disableClearable
                            name="groupSmtpServerName"
                            options={[]}
                            size="small"
                            value={formik.values.groupSmtpServerName}
                            onChange={(event, newValue) => {
                              formik.setFieldValue(
                                "groupSmtpServerName",
                                newValue
                              );
                            }}
                            onBlur={formik.handleBlur}
                            renderInput={(params) => (
                              <TextField
                                error={
                                  formik.touched.groupSmtpServerName &&
                                  Boolean(formik.errors.groupSmtpServerName)
                                }
                                helperText={
                                  formik.touched.groupSmtpServerName &&
                                  formik.errors.groupSmtpServerName
                                }
                                {...params}
                                label="Server Name "
                              />
                            )}
                          />
                          <Autocomplete
                            sx={{ width: "18vw", height: "75px" }}
                            id="groupSmtpList"
                            disableClearable
                            name="groupSmtpList"
                            options={[]}
                            size="small"
                            value={formik.values.groupSmtpList}
                            onChange={(event, newValue) => {
                              formik.setFieldValue("groupSmtpList", newValue);
                            }}
                            onBlur={formik.handleBlur}
                            renderInput={(params) => (
                              <TextField
                                error={
                                  formik.touched.groupSmtpList &&
                                  Boolean(formik.errors.groupSmtpList)
                                }
                                helperText={
                                  formik.touched.groupSmtpList &&
                                  formik.errors.groupSmtpList
                                }
                                {...params}
                                label="SMTP List"
                              />
                            )}
                          />
                        </Grid>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              {/* /// box4 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 3,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Box>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Grid>
                        <TextField
                          sx={{
                            mt: 2,
                            width: "25vw",
                          }}
                          size="small"
                          id="fromName"
                          name="fromName"
                          label="From Name *"
                          variant="outlined"
                          fullWidth
                          // size="small"
                          // rows={8}
                          // multiline
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.fromName}
                          error={
                            formik.touched.fromName &&
                            Boolean(formik.errors.fromName)
                          }
                          helperText={
                            formik.touched.fromName && formik.errors.fromName
                          }
                        />
                      </Grid>
                      <Grid>
                        <TextField
                          sx={{ mt: 2, width: "25vw" }}
                          id="subjectLine"
                          name="subjectLine"
                          label="Subject Line  *"
                          variant="outlined"
                          fullWidth
                          // rows={8}
                          multiline
                          size="small"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.subjectLine}
                          error={
                            formik.touched.subjectLine &&
                            Boolean(formik.errors.subjectLine)
                          }
                          helperText={
                            formik.touched.subjectLine &&
                            formik.errors.subjectLine
                          }
                        />
                        <div style={{ width: "25vw", marginTop: "5px" }}>
                          {emailTags &&
                            emailTags?.map((ele, i) => (
                              <Button
                                key={i}
                                size="small"
                                variant="contained"
                                onClick={() => {
                                  navigator.clipboard.writeText(ele.value);
                                  enqueueSnackbar("Copied", {
                                    variant: "success",
                                  });
                                }}
                                sx={{
                                  backgroundColor: "#FFDFC5",
                                  color: "black",
                                  fontSize: "10px",
                                  margin: "2px",
                                }}
                              >
                                {ele?.label}
                              </Button>
                            ))}
                        </div>
                      </Grid>
                      <Grid>
                        <TextField
                          sx={{ mt: 2, width: "25vw" }}
                          id="fromDomain"
                          name="fromDomain"
                          label="From Domain *"
                          // rows={8}
                          multiline
                          variant="outlined"
                          fullWidth
                          size="small"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.fromDomain}
                          error={
                            formik.touched.fromDomain &&
                            Boolean(formik.errors.fromDomain)
                          }
                          helperText={
                            formik.touched.fromDomain &&
                            formik.errors.fromDomain
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Grid>
                        <TextField
                          sx={{ mt: 2, width: "25vw" }}
                          id="fromEmailName"
                          name="fromEmailName"
                          // rows={8}
                          // multiline
                          label="From Email Name  "
                          variant="outlined"
                          size="small"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.fromEmailName}
                          error={
                            formik.touched.fromEmailName &&
                            Boolean(formik.errors.fromEmailName)
                          }
                          helperText={
                            formik.touched.fromEmailName &&
                            formik.errors.fromEmailName
                          }
                        />
                      </Grid>
                      <Grid>
                        <TextField
                          sx={{ mt: 2, width: "25vw" }}
                          id="replyTo"
                          name="replyTo"
                          label="Reply To *"
                          variant="outlined"
                          // rows={8}
                          // multiline
                          size="small"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.replyTo}
                          error={
                            formik.touched.replyTo &&
                            Boolean(formik.errors.replyTo)
                          }
                          helperText={
                            formik.touched.replyTo && formik.errors.replyTo
                          }
                        />
                      </Grid>
                      <Grid>
                        <Autocomplete
                          sx={{ mt: 2 }}
                          id="emailHeader"
                          options={emailHeader}
                          value={formik.values.emailHeader}
                          getOptionLabel={(option) => option}
                          onChange={(e, newValue) => {
                            formik.setFieldValue("emailHeader", newValue, true);
                          }}
                          size="small"
                          onBlur={formik.handleBlur}
                          renderInput={(params) => (
                            <TextField {...params} label="Email Header " />
                          )}
                        />
                        {/* <TextField
                          sx={{ mt: 2, width: "25vw" }}
                          id="emailHeader"
                          name="emailHeader"
                          // rows={8}
                          multiline
                          label="Email Header "
                          variant="outlined"
                          fullWidth
                          size="small"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.emailHeader}
                          error={
                            formik.touched.emailHeader &&
                            Boolean(formik.errors.emailHeader)
                          }
                          helperText={
                            formik.touched.emailHeader &&
                            formik.errors.emailHeader
                          }
                        /> */}
                        <div style={{ width: "25vw", marginTop: "5px" }}></div>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Box>
              {/* /// box5 */}
              <Box sx={{ mt: 2 }}>
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel-content"
                      id="panel-header"
                    >
                      <Typography variant="h4">Template Preview *</Typography>
                    </AccordionSummary>
                    <Autocomplete
                      sx={{ width: "38vw", height: "75px", ml: "20px" }}
                      disableClearable
                      options={templateDetails}
                      getOptionLabel={(option) => option.template_name}
                      size="small"
                      // value={formik.values.espName || null}
                      onChange={(event, newValue) => {
                        onEditorChange(newValue?.template_html);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Template" />
                      )}
                    />

                    <AccordionDetails>
                      <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            height: "60vh",
                            overflowY: "scroll",
                            overflowX: "hidden",
                          }}
                        >
                          {/* editor */}
                          <Box
                            sx={{
                              width: "50%",
                            }}
                          >
                            <AceEditor
                              mode="html"
                              theme="monokai"
                              name="templateHtml"
                              height="100%"
                              width="100%"
                              ref={aceEditorRef}
                              onChange={onEditorChange}
                              fontSize={14}
                              showPrintMargin={true}
                              focus={true}
                              editorProps={{ $blockScrolling: true }}
                              wrapEnabled={true}
                              highlightActiveLine={true}
                              autoScrollEditorIntoView={true}
                              value={formik.values.htmlCode}
                              setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true,
                                showLineNumbers: true,
                                tabSize: 2,
                                showGutter: true,
                              }}
                            />
                          </Box>
                          {/* output */}
                          <div
                            style={{ width: "50%", overflow: "scroll" }}
                            dangerouslySetInnerHTML={{
                              __html: formik?.values?.htmlCode,
                            }}
                          ></div>
                        </Box>
                        {formik.touched.htmlCode && formik.errors.htmlCode && (
                          <div style={{ color: "red", marginTop: "5px" }}>
                            {formik.errors.htmlCode}
                          </div>
                        )}
                        <Typography>Add Link Tag</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "5px",
                            width: "600px",
                            flexWrap: "wrap",
                            marginTop: "5px",
                          }}
                        >
                          {emailTags &&
                            emailTags?.map((ele, i) => (
                              <Button
                                key={i}
                                size="small"
                                variant="contained"
                                onClick={() => {
                                  navigator.clipboard.writeText(ele.value);
                                  enqueueSnackbar("Copied", {
                                    variant: "success",
                                  });
                                }}
                                sx={{
                                  backgroundColor: "#FFDFC5",
                                  color: "black",
                                  fontSize: "10px",
                                }}
                              >
                                {ele?.label}
                              </Button>
                            ))}
                        </Box>
                      </Box>
                    </AccordionDetails>
                </Paper>
              </Box>
              {/* mohan segnment start*/}
              <Box
                sx={{
                  width: "100%",
                  mt: 3,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Box
                    sx={
                      {
                        // display: "flex",
                        // flexDirection: "column",
                        // border: "2px solid red",
                        // sx={{ maxHeight: "400px", overflow: "auto" }}
                      }
                    }
                  >
                    <Grid
                      sx={{
                        // border: "2px solid green",
                        my: 2,
                      }}
                    >
                      <Autocomplete
                        sx={{ width: "50vw" }}
                        multiple
                        id="listId"
                        size="small"
                        options={listData}
                        // disableCloseOnSelect
                        getOptionLabel={(option) =>
                          `${option.list_name} (${option.records})`
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {option.list_name} ({option.records})
                          </li>
                        )}
                        // style={{ width: 500 }}
                        value={formik.values.listId}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("listId", newValue);
                        }}
                        onBlur={formik.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            error={
                              formik.touched.listId &&
                              Boolean(formik.errors.listId)
                            }
                            helperText={
                              formik.touched.listId && formik.errors.listId
                            }
                            {...params}
                            label="Select List"
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      sx={{
                        // display: "flex",
                        width: "100%",
                        // height: "100%",
                        maxHeight: "662px",
                        overflow: "auto",
                      }}
                    >
                      {formik.values.segmentData &&
                        formik.values.segmentData.map((element) => (
                          <Box key={element.listId}>
                            <h2>
                              Segment Data for List Name: {element.list_name}
                            </h2>
                            <ul>
                              {element.data.map((segment) => (
                                <li key={segment.segmentid}>
                                  <strong>Segment Name:</strong>{" "}
                                  {segment.segment_name},{" "}
                                  <strong>Count:</strong> {segment.count}
                                  <RadioGroup
                                    row
                                    aria-label={`segmentType_${element.listId}_${segment.segmentid}`}
                                    value={segment.type} // Set value to segment.type
                                    onChange={(e) => {
                                      // Construct updated formik values
                                      const updatedValues = {
                                        ...formik.values,
                                        segmentData:
                                          formik.values.segmentData.map(
                                            (el) => ({
                                              ...el,
                                              data: el.data.map((seg) =>
                                                seg.segmentid ===
                                                segment.segmentid
                                                  ? {
                                                      ...seg,
                                                      type: e.target.value,
                                                    }
                                                  : seg
                                              ),
                                            })
                                          ),
                                      };
                                      // Update formik values
                                      formik.setValues(updatedValues);
                                    }}
                                  >
                                    <FormControlLabel
                                      value="none"
                                      control={<Radio />}
                                      label="None"
                                    />
                                    <FormControlLabel
                                      value="includeSegnment"
                                      control={<Radio />}
                                      label="Include Segnment"
                                    />
                                    <FormControlLabel
                                      value="excludeSegnment"
                                      control={<Radio />}
                                      label="Exclude Segnment"
                                    />
                                  </RadioGroup>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        ))}
                    </Grid>
                  </Box>
                </Paper>
              </Box>
              {/* mohan segnment end*/}
              {/* supresssion list */}
              <Box
                sx={{
                  width: "100%",
                  mt: 3,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Box
                    sx={
                      {
                        // display: "flex",
                        // flexDirection: "column",
                        // border: "2px solid red",
                        // sx={{ maxHeight: "400px", overflow: "auto" }}
                      }
                    }
                  >
                    <Autocomplete
                      multiple
                      sx={{ width: "50vw" }}
                      id="suppressionListId"
                      size="small"
                      name="suppressionListId"
                      value={formik.values.suppressionListId}
                      options={suppressionList}
                      getOptionLabel={(option) =>
                        `${option.list_name} (${option.list_type}) (${option.list_data_type})`
                      }
                      onChange={(e, newValue) => {
                        formik.setFieldValue(
                          "suppressionListId",
                          newValue,
                          true
                        );
                      }}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          error={
                            formik.touched.suppressionListId &&
                            Boolean(formik.errors.suppressionListId)
                          }
                          helperText={
                            formik.touched.suppressionListId &&
                            formik.errors.suppressionListId
                          }
                          {...params}
                          label="Suppresion *"
                        />
                      )}
                    />
                  </Box>
                </Paper>
              </Box>
              {/* /// box 6 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 0 }}>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                      pt: "25px",
                    }}
                  >
                    <Grid item>
                      <TextField
                        sx={{ width: "30vw", height: "75px" }}
                        id="rangeFrom"
                        name="rangeFrom"
                        type="number"
                        label="Start From Count "
                        size="small"
                        value={formik.values.rangeFrom}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.rangeFrom &&
                          Boolean(formik.errors.rangeFrom)
                        }
                        helperText={
                          formik.touched.rangeFrom && formik.errors.rangeFrom
                        }
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: "30vw", height: "75px" }}
                        id="rangeTo"
                        name="rangeTo"
                        label="End To Count"
                        type="number"
                        size="small"
                        value={formik.values.rangeTo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.rangeTo &&
                          Boolean(formik.errors.rangeTo)
                        }
                        helperText={
                          formik.touched.rangeTo && formik.errors.rangeTo
                        }
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: "30vw", height: "75px" }}
                        id="maxCount"
                        name="maxCount"
                        label="Max Data Limit"
                        size="small"
                        type="number"
                        value={formik.values.maxCount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.maxCount &&
                          Boolean(formik.errors.maxCount)
                        }
                        helperText={
                          formik.touched.maxCount && formik.errors.maxCount
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              {/* /// box7 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 0 }}>
                  <Typography sx={{ p: 4 }} variant="h4">
                    {" "}
                    Enrich Data (To store this campaign's Opener/Clicker/Unsub
                    to any particular list.)
                  </Typography>

                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                      pt: "0px",
                    }}
                  >
                    <Grid item>
                      <Autocomplete
                        sx={{ width: "30vw", height: "75px" }}
                        id="open"
                        disableClearable
                        name="enrichData.open"
                        options={listData}
                        getOptionLabel={(option) =>
                          `${option.list_name} (${option.records})`
                        }
                        size="small"
                        value={formik.values.enrichData.open || null}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("enrichData.open", newValue);
                        }}
                        onBlur={formik.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            // error={
                            //   formik.touched.offerId &&
                            //   Boolean(formik.errors.offerId)
                            // }
                            // helperText={
                            //   formik.touched.offerId && formik.errors.offerId
                            // }
                            {...params}
                            label="For Open"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Autocomplete
                        sx={{ width: "30vw", height: "75px" }}
                        id="click"
                        disableClearable
                        name="enrichData.click"
                        options={listData}
                        getOptionLabel={(option) =>
                          `${option.list_name} (${option.records})`
                        }
                        size="small"
                        value={formik.values.enrichData.click || null}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("enrichData.click", newValue);
                        }}
                        onBlur={formik.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            // error={
                            //   formik.touched.offerId &&
                            //   Boolean(formik.errors.offerId)
                            // }
                            // helperText={
                            //   formik.touched.offerId && formik.errors.offerId
                            // }
                            {...params}
                            label="For Click"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Autocomplete
                        sx={{ width: "30vw", height: "75px" }}
                        id="unsub"
                        disableClearable
                        name="enrichData.unsub"
                        options={suppressionList}
                        getOptionLabel={(option) =>
                          `${option.list_name} (${option.list_type}) (${option.list_data_type})`
                        }
                        size="small"
                        value={formik.values.enrichData.unsub || null}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("enrichData.unsub", newValue);
                        }}
                        onBlur={formik.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            // error={
                            //   formik.touched.offerId &&
                            //   Boolean(formik.errors.offerId)
                            // }
                            // helperText={
                            //   formik.touched.offerId && formik.errors.offerId
                            // }
                            {...params}
                            label="For Unsub"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              {/* /// box 8 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Grid
                    sx={{
                      display: "flex",
                      width: "100%",
                      pt: "0px",
                    }}
                  >
                    <Grid item>
                      <TextField
                        sx={{ width: "30vw", height: "75px" }}
                        id="acknowledgmentEmail"
                        name="acknowledgmentEmail"
                        label="Acknowledgment Email"
                        size="small"
                        value={formik.values.acknowledgmentEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.acknowledgmentEmail &&
                          Boolean(formik.errors.acknowledgmentEmail)
                        }
                        helperText={
                          formik.touched.acknowledgmentEmail &&
                          formik.errors.acknowledgmentEmail
                        }
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        sx={{ width: "30vw", height: "75px", ml: 4 }}
                        size="small"
                        onKeyDown={(evt) =>
                          (evt.key === "-" ||
                            evt.key === "e" ||
                            evt.key === "E") &&
                          evt.preventDefault()
                        }
                        id="acknowledgmentAfterCount"
                        name="acknowledgmentAfterCount"
                        label="Acknowledgment After Count"
                        type="number"
                        value={formik.values.acknowledgmentAfterCount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.acknowledgmentAfterCount &&
                          Boolean(formik.errors.acknowledgmentAfterCount)
                        }
                        helperText={
                          formik.touched.acknowledgmentAfterCount &&
                          formik.errors.acknowledgmentAfterCount
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              {/* /// box 9 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Grid
                    sx={{
                      display: "flex",
                      width: "100%",
                      pt: "0px",
                    }}
                  >
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      Take a pause during the running campaign for
                    </Typography>
                    <Grid item>
                      <TextField
                        sx={{ width: "18vw", height: "75px", ml: 3 }}
                        id="breakActionTime"
                        name="breakActionTime"
                        label="Enter Count"
                        size="small"
                        type="number"
                        value={formik.values.breakActionTime}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.breakActionTime &&
                          Boolean(formik.errors.breakActionTime)
                        }
                        helperText={
                          formik.touched.breakActionTime &&
                          formik.errors.breakActionTime
                        }
                      />
                    </Grid>
                    <Typography variant="h5" sx={{ mt: 1, ml: 3 }}>
                      seconds after each
                    </Typography>
                    <Grid item>
                      <TextField
                        sx={{ width: "18vw", height: "75px", ml: 4 }}
                        id="breakActionCount"
                        name="breakActionCount"
                        label="Enter  Count"
                        size="small"
                        type="number"
                        value={formik.values.breakActionCount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.breakActionCount &&
                          Boolean(formik.errors.breakActionCount)
                        }
                        helperText={
                          formik.touched.breakActionCount &&
                          formik.errors.breakActionCount
                        }
                      />
                    </Grid>
                    <Typography variant="h5" sx={{ mt: 1, ml: 3 }}>
                      emails sent.
                    </Typography>
                  </Grid>
                </Paper>
              </Box>
              {/* // box 10 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Grid
                    sx={{
                      width: "100%",
                      pt: "0px",
                    }}
                  >
                    <Typography variant="h4">Test Campaign</Typography>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ mt: 2, width: "30vw" }}
                        id="emails"
                        name="emails"
                        // label="Enter emails"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={8}
                        // onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your email here... 
                        Use New Line (↵) For Separator"
                        // value={formik.values.emails}
                        value={inputValue || null}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setInputValue(e.target.value);
                        }}
                        error={
                          formik.touched.emails && Boolean(formik.errors.emails)
                        }
                        helperText={
                          formik.touched.emails && formik.errors.emails
                        }
                      />
                      <Button
                        onClick={() => {
                          // debugger;
                          handleValidateSchema("test");
                          setSentMail(true);
                          createArray();
                        }}
                        type="submit"
                        variant="contained"
                        sx={{ ml: "10px" }}
                      >
                        Send Test Mail{" "}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              {/* /// box 11 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                  mb: 2,
                }}
              >
                <Paper elevation={3} style={{ borderRadius: 10, padding: 20 }}>
                  <Grid
                    sx={{
                      width: "100%",
                      pt: "0px",
                    }}
                  >
                    <Typography variant="h4">Timezone *</Typography>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Autocomplete
                        sx={{ width: "30vw", height: "75px", mt: 2 }}
                        id="timezone"
                        disableClearable
                        name="timezone"
                        options={timeZoneLists}
                        getOptionLabel={(option) => option.label}
                        size="small"
                        value={formik.values.timezone || null}
                        onChange={(event, newValue) => {
                          formik.setFieldValue("timezone", newValue);
                        }}
                        onBlur={formik.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            error={
                              formik.touched.timezone &&
                              Boolean(formik.errors.timezone)
                            }
                            helperText={
                              formik.touched.timezone && formik.errors.timezone
                            }
                            {...params}
                            label="Select one Timezone"
                          />
                        )}
                      />
                    </Grid>
                    <Grid>
                      <RadioGroup
                        row
                        name="scheduleType"
                        value={formik.values.scheduleType}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel
                          onChange={() => setNameChange("Schedule Now")}
                          labelPlacement="start"
                          value="schedulNow"
                          control={<Radio />}
                          label="Schedule Now"
                        />
                        <FormControlLabel
                          onChange={() => setNameChange("Schedular Later")}
                          labelPlacement="start"
                          value="schedularLater"
                          control={<Radio />}
                          label="Schedular Later"
                        />
                      </RadioGroup>
                      {formik.touched.scheduleType &&
                      formik.errors.scheduleType ? (
                        <div style={{ color: "red" }}>
                          {formik.errors.scheduleType}
                        </div>
                      ) : null}
                      {formik.values.scheduleType === "schedularLater" && (
                        <Grid sx={{ mt: 2, display: "flex", gap: "10px" }}>
                          <Grid>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                  value={dayjs(formik.values.scheduleDate)}
                                  label="Schedule Date"
                                  size="medium"
                                  onChange={(newValue) => {
                                    const value = new Date(newValue.$d);
                                    const currentTime = new Date();
                                    value.setHours(currentTime.getHours());
                                    value.setMinutes(currentTime.getMinutes());
                                    value.setSeconds(currentTime.getSeconds());
                                    formik.setFieldValue(
                                      "scheduleDate",
                                      value,
                                      true
                                    );
                                  }}
                                  slotProps={{
                                    textField: {
                                      helperText: Boolean(
                                        formik.errors.scheduleDate
                                      )
                                        ? formik.errors.scheduleDate
                                        : "",
                                    },
                                  }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>
                          <Grid>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["TimePicker"]}>
                                {/* <Stack spacing={2} sx={{ minWidth: 305, }}> */}
                                <TimePicker
                                  size="small"
                                  label="Schedule Time"
                                  name="scheduleStartTime"
                                  id="scheduleStartTime"
                                  // value={dayjs(
                                  //   formik?.values?.scheduleStartTime
                                  // )}
                                  value={dayjs(
                                    `2022-04-17T${formik.values?.scheduleStartTime}`
                                  )}
                                  // value={`2022-04-17T${formik.values?.scheduleStartTime}`}
                                  onChange={(newValue) => {
                                    // debugger;
                                    const value = moment(newValue.$d).format(
                                      "HH:mm"
                                    );
                                    // const value = newValue?.format("HH:mm");
                                    formik.setFieldValue(
                                      "scheduleStartTime",
                                      value,
                                      true
                                    );
                                  }}
                                  referenceDate={dayjs("2022-04-17")}
                                  slotProps={{
                                    textField: {
                                      helperText: Boolean(
                                        formik?.errors?.scheduleStartTime
                                      )
                                        ? formik.errors.scheduleStartTime
                                        : "",
                                    },
                                  }}
                                />
                                {/* </Stack> */}
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    sx={{
                      width: "100%",
                      pt: "0px",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "30px",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setFieldValues(defaultValues);
                        formik.resetForm();
                        setDefaultValues({});
                      }}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    {/* <Button variant="contained">Preview</Button> */}

                    <PreviewForm values={formik.values} />
                    {/* <Button variant="outlined">Save Campaign</Button> */}
                    <Button
                      onClick={() => {
                        handleValidateSchema("campaignSubmit");
                        // handleValidateSchema("campaignSubmit")
                        setSentMail(false);
                      }}
                      variant="contained"
                      type="submit"
                    >
                      {nameChange}
                    </Button>
                  </Grid>
                </Paper>
              </Box>
            </form>
          </Box>
        </div>
      </Drawer>
    </>
  );
};

export default QuickCampaignDrawer;
