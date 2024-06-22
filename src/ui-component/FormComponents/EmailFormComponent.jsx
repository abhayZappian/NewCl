import React, { useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  Box,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import {
  setDrawerOpen,
  setFormData,
  setOfferData,
  setSuppressionData,
  setTemplateData,
  setemailServiceProviderData,
} from "store/action/journeyCanvas";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  selectEmailServiceAccountData,
  selectEmailServiceProviderData,
  selectGetFormData,
  selectOffertData,
  selectTemplateData,
  selectsuppressiondData,
} from "store/selectors";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { Suspense } from "react";
import { baseURL } from "config/envConfig";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Icon from "@mdi/react";
import { mdiEyeCircleOutline } from "@mdi/js";
import CloseIcon from "@mui/icons-material/Close";
import DOMPurify from "dompurify";

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
const validationSchema = Yup.object().shape({
  offerId: Yup.mixed().required("Offer ID required"),
  espName: Yup.mixed().required("Esp Name required"),
  emailServiceAccount: Yup.mixed().required(
    "email Service Account is required"
  ),
  templateList: Yup.mixed().required("Template List is required"),
  fromName: Yup.mixed().required("From Name required"),
  subjectLine: Yup.mixed().required("Subject Line required"),
  fromDomain: Yup.mixed().required("From Domain required"),
  replyTo: Yup.mixed().required("Reply To required"),
  suppression: Yup.array()
    .min(1, "Select at least one Suppresion")
    .of(Yup.mixed().required("Multi-Select is required")),
  emails: Yup.string()
    .test("is-required", "Email Required", function (value) {
      const { sendEmailType } = this.parent;
      if (sendEmailType === "campaign" && !value) {
        return false;
      } else {
        return true;
      }
    })
    .nullable(),
});
const validationSchema2 = Yup.object().shape({
  offerId: Yup.mixed().required("Offer ID required"),
  espName: Yup.mixed().required("Esp Name  required"),
  emailServiceAccount: Yup.mixed().required(
    "email Service Account is required"
  ),
  suppression: Yup.array()
    .min(1, "Select at least one suppression")
    .of(Yup.mixed().required("Multi-Select is required")),
  templateList: Yup.mixed().required("Template List  required"),
  fromName: Yup.string()
    .trim()
    .required("From name  required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
  subjectLine: Yup.string()
    .trim()
    .required("Subject Line  required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
  fromDomain: Yup.string()
    .trim()
    .required("From Domain  required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
  replyTo: Yup.string()
    .trim()
    .required("Reply To  required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
});

const validationSchemaPool = Yup.object().shape({
  poolOfferId: Yup.mixed().required("Offer ID required"),
  poolEspName: Yup.mixed().required("Esp Name  required"),
  poolTemplateList: Yup.mixed().required("Template List  required"),
  poolSubjectLine: Yup.mixed().required("Subject Line required"),
  poolFromEmail: Yup.mixed().required("From Domain required"),
  poolEmailHeader: Yup.mixed().required("From Email Header  required"),
  poolSuppression: Yup.array()
    .min(1, "Select at least one Suppresion")
    .of(Yup.mixed().required("Multi-Select is required")),
  emails: Yup.string()
    .test("is-required", "", function (value) {
      const { sendEmailType } = this.parent;
      if (sendEmailType === "campaign" && !value) {
        return false;
      } else {
        return true;
      }
    })
    .nullable(),
});

export const EmailFormComponent = () => {
  const dispatch = useDispatch();
  const offerData = useSelector(selectOffertData);
  const serviceProviderData = useSelector(selectEmailServiceProviderData);
  const initialTemplateData = useSelector(selectTemplateData);
  const initialEmailServiceAccount = useSelector(selectEmailServiceAccountData);
  const suppressiondData = useSelector(selectsuppressiondData) || [];

  const [offerOptions, setOfferOptions] = useState(offerData);
  const intialFormData = useSelector(selectGetFormData) || {};
  const { enqueueSnackbar } = useSnackbar();
  const [espNameOptions, setEspNameOptions] = useState(serviceProviderData);
  const [emailServiceAccountOptions, setEmailServiceAccountOptions] = useState(
    initialEmailServiceAccount
  );
  const [templateOptions, setTemplateOptions] = useState(initialTemplateData);
  const [suppression, setSuppresion] = useState([]);
  const [sentMail, setSentMail] = useState(true);
  const [sendTestEmail, setSendTestEmail] = useState();
  const [poolOfferList, setPoolOfferList] = useState([]);
  const [poolOfferEsps, setPoolOfferEsps] = useState([]);
  const [poolTemplateList, setPoolTemplateList] = useState([]);
  const [poolHeaderList, setPoolHeaderList] = useState([]);
  const [poolFromNameList, setPoolFromNameList] = useState([]);
  const [poolSubjectLineList, setPoolSubjectLineList] = useState([]);
  const [emailHeader, setEmailheader] = useState([]);
  const [switchPool, setSwitchPool] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [finalSchema, setFinalSchema] = useState(validationSchema);
  const PreviewModal = ({ open, handleClose, htmlContent }) => (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            position: "fixed",
            top: 5,
            right: 5,
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "red",
            },
          }}
        >
          <CloseIcon />
        </Button>{" "}
        {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
        <SafeHtmlContent htmlContent={htmlContent} />
      </div>
    </Modal>
  );
  const SafeHtmlContent = ({ htmlContent }) => {
    const createMarkup = (html) => {
      return { __html: DOMPurify.sanitize(html) };
    };

    return <div dangerouslySetInnerHTML={createMarkup(htmlContent)} />;
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vw",
    backgroundColor: "white",
    padding: "16px 32px 24px",
    boxShadow: 24,
    outline: "none",
    height: "80vh",
    // overflow:"scrool"
    overflow: "scroll",
  };
  const handleValidateSchema = (data) => {
    // debugger;
    if (data === "test") {
      setFinalSchema(validationSchema);
    } else if (data === "campaignSubmit") {
      setFinalSchema(validationSchema2);
    } else if (data === "poolSubmit") {
      setFinalSchema(validationSchemaPool);
    }
  };

  const modifiedSuppresion = suppression.map((item) => ({
    listid: item.listid,
    list_name: item.list_name,
    list_type: item.list_type,
    list_data_type: item.list_data_type,
  }));

  const getData = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.getSuppresion);
    setSuppresion(data);
    dispatch(setSuppressionData(data));
  };
  const getEmailHeader = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.getHeaderNames);
    console.log(data?.result, "ooo");
    setEmailheader(data?.result);
    // dispatch(setSuppressionData(data));
  };

  const handleSubmit = (values) => {
    dispatch(setFormData(values));
  };

  const getSendTestEmail = async (sendTestEmail) => {
    const data = await axiosInstance.post(
      apiEndPoints.getSendTestEmail,
      sendTestEmail
    );
    if (data.status === 200) {
      enqueueSnackbar("Test email sent successfully !!!", {
        variant: "success",
      });
      setSendTestEmail(data);
    }
  };
  const getPoolOffers = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${baseURL}${apiEndPoints.poolByPoolType}/Offers`
      );
      //   console.log(data.results, "offersr");
      setPoolOfferList(data?.results);
    } catch (error) {
      console.log(error);
    }
  };
  const getPoolEsp = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${baseURL}${apiEndPoints.poolByPoolType}/Esps`
      );
      setPoolOfferEsps(data?.results);
    } catch (error) {}
  };
  const getPoolTemplate = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${baseURL}${apiEndPoints.poolByPoolType}/Templates`
      );
      setPoolTemplateList(data?.results);
    } catch (error) {}
  };
  const getPoolHeader = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${baseURL}${apiEndPoints.poolByPoolType}/Headers`
      );
      setPoolHeaderList(data?.results);
    } catch (error) {}
  };
  const getPoolFromName = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${baseURL}${apiEndPoints.poolByPoolType}/From Names`
      );
      setPoolFromNameList(data?.results);
    } catch (error) {}
  };
  const getPoolSubjectLine = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${baseURL}${apiEndPoints.poolByPoolType}/Subject Lines`
      );
      setPoolSubjectLineList(data?.results);
    } catch (error) {}
  };
  useEffect(() => {
    if (
      offerData.length === 0 &&
      serviceProviderData.length === 0 &&
      initialTemplateData.length === 0
    ) {
      fetchData();
    }
    if (suppressiondData) {
    }
    getData();
    getPoolOffers();
    getPoolEsp();
    getPoolTemplate();
    getPoolHeader();
    getPoolFromName();
    getPoolSubjectLine();
    getEmailHeader();
  }, []);

  const fetchData = async () => {
    try {
      const offersResponse = await axiosInstance.get(apiEndPoints.offer);
      const offersData = offersResponse.data;
      setOfferOptions(offersData);
      dispatch(setOfferData(offersData));

      // Fetch Esp Name options using Axios
      const espNameResponse = await axiosInstance.get(
        apiEndPoints.emailServiceProvider
      );
      const espNameData = espNameResponse?.data;
      setEspNameOptions(espNameData);
      dispatch(setemailServiceProviderData(espNameData));

      // Fetch Template Name options using Axios
      const templateResponse = await axiosInstance.get(
        apiEndPoints.allTemplateDetails
      );
      const templateData = templateResponse.data.result;
      setTemplateOptions(templateData);
      dispatch(setTemplateData(templateData));
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchEmailServiceAccounts = async (esp_id) => {
    try {
      const response = await axiosInstance.get(
        `${apiEndPoints.emailServiceProviderAccounts}/${esp_id}`
      );
      const data = response.data;
      setEmailServiceAccountOptions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchEmailDomainName = async (esp_account_id, esp) => {
    try {
      const response = await axiosInstance.get(
        `${apiEndPoints.getDomainByESP}/${esp_account_id}/${esp}`
      );
      const data = response.data;
      formik.setFieldValue("fromDomain", data[0].fromDomain);
      formik.setFieldValue("replyTo", data[0].replyTo);
      formik.setFieldValue("fromEmailName", data[0].replyTo);
      // setEmailServiceAccountOptions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [inputValue, setInputValue] = useState("");

  const [valuesArray, setValuesArray] = useState([]);
  const createArray = () => {
    const newArray = inputValue.split("\n");
    const filteredArray = newArray.filter((value) => value.trim() !== "");
    setValuesArray((prevArray) => [...prevArray, ...filteredArray]);
    setInputValue("");
  };
  const formik = useFormik({
    initialValues: {
      offerId: intialFormData.offerId || "",
      espName: intialFormData.espName || "",
      emailServiceAccount: intialFormData.emailServiceAccount || "",
      templateList: intialFormData.templateList || "",
      subID1: intialFormData.subID1 || "",
      subID2: intialFormData.subID2 || "",
      subID3: intialFormData.subID3 || "",
      fromName: intialFormData.fromName || "",
      subjectLine: intialFormData.subjectLine || "",
      fromDomain: intialFormData.fromDomain || "",
      fromEmailName: intialFormData.fromEmailName || "",
      replyTo: intialFormData.replyTo || "",
      emailHeader: intialFormData.emailHeader || null,
      suppression: intialFormData.suppression || [],
      emails: null,
      sendEmailType: intialFormData.sendEmailType || "campaign",
      // pool
      poolOfferId: intialFormData.poolOfferId,
      poolEspName: intialFormData.poolEspName || "",
      poolTemplateList: intialFormData.poolTemplateList || "",
      poolSubID1: intialFormData.poolSubID1 || "",
      poolSubID2: intialFormData.poolSubID2 || "",
      poolSubID3: intialFormData.poolSubID3 || "",
      poolFromName: intialFormData.poolFromName || "",
      poolSubjectLine: intialFormData.poolSubjectLine || "",
      poolFromEmail: intialFormData.poolFromEmail || "",
      poolEmailHeader: intialFormData.poolEmailHeader || "",
      poolSuppression: intialFormData.poolSuppression || [],
      poolEmails: null,
    },
    validationSchema: finalSchema,
    onSubmit: (values) => {
      if (values.sendEmailType === "campaign") {
        if (sentMail === true) {
          const data = {
            offerId: values.offerId,
            espName: values.espName,
            emailServiceAccount: values.emailServiceAccount,
            templateList: values.templateList,
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
            sendEmailType: values.sendEmailType,
          };
          console.log(data, "campaign");
          getSendTestEmail(data);
          // enqueueSnackbar('Form Submitted Successfully !!!', {
          //     variant: 'success'
          // });
          dispatch(setFormData(data));
          // dispatch(setDrawerOpen(false));
          // console.log(data, 'dataaaa');
        } else {
          enqueueSnackbar("Form Submitted Successfully !!!", {
            variant: "success",
          });
          dispatch(setFormData(values));
          dispatch(setDrawerOpen(false));
        }
      } else {
        console.log(values, "ooooooooooo");
        const data = {
          poolOfferId: {
            id: values?.poolOfferId?._id,
            poolName: values?.poolOfferId?.poolName,
          },
          poolEspName: {
            id: values?.poolEspName?._id,
            poolName: values?.poolEspName?.poolName,
          },
          poolTemplateList: {
            id: values?.poolTemplateList?._id,
            poolName: values?.poolTemplateList?.poolName,
          },
          poolSubID1: values.poolSubID1,
          poolSubID2: values.poolSubID2,
          poolSubID3: values.poolSubID3,
          poolFromName: {
            id: values?.poolFromName?._id,
            poolName: values?.poolFromName?.poolName,
          },
          poolSubjectLine: {
            id: values?.poolSubjectLine?._id,
            poolName: values?.poolSubjectLine?.poolName,
          },
          poolFromEmail: values.poolFromEmail,
          // fromEmailName: values.fromEmailName,
          // replyTo: values.poolReplyTo,
          poolEmailHeader: {
            id: values?.poolEmailHeader?._id,
            poolName: values?.poolEmailHeader?.poolName,
          },
          poolSuppression: values.poolSuppression,
          sendEmailType: values.sendEmailType,
        };
        console.log(data, "pool");
        dispatch(setFormData(data));
        dispatch(setDrawerOpen(false));
        enqueueSnackbar("Form Submitted Successfully !!!", {
          variant: "success",
        });
      }
    },
  });
  const resetCampaignForm = () => {
    dispatch(
      setFormData({
        offerId: "",
        espName: "",
        emailServiceAccount: "",
        templateList: "",
        subID1: "",
        subID2: "",
        subID3: "",
        fromName: "",
        subjectLine: "",
        fromDomain: "",
        fromEmailName: "",
        replyTo: "",
        emailHeader: "",
        suppression: "",
        emails: null,
      })
    );
    formik.setFieldValue("offerId", "", true);
    formik.setFieldValue("espName", "", true);
    formik.setFieldValue("emailServiceAccount", "", true);
    formik.setFieldValue("templateList", "", true);
    formik.setFieldValue("subID1", "", true);
    formik.setFieldValue("subID2", "", true);
    formik.setFieldValue("subID3", "", true);
    formik.setFieldValue("fromName", "", true);
    formik.setFieldValue("subjectLine", "", true);
    formik.setFieldValue("fromDomain", "", true);
    formik.setFieldValue("fromEmailName", "", true);
    formik.setFieldValue("replyTo", "", true);
    formik.setFieldValue("emailHeader", "", true);
    formik.setFieldValue("suppression", [], true);
    formik.setFieldValue("emails", null, true);
  };
  const resetPoolForm = () => {
    dispatch(
      setFormData({
        poolOfferId: "",
        poolEspName: "",
        poolTemplateList: "",
        poolSubID1: "",
        poolSubID2: "",
        poolSubID3: "",
        poolFromName: "",
        poolSubjectLine: "",
        poolFromEmail: "",
        poolEmailHeader: "",
        poolSuppression: [],
      })
    );

    formik.resetForm();
    formik.setFieldValue("poolOfferId", "", true);
    formik.setFieldValue("poolEspName", "", true);
    formik.setFieldValue("poolTemplateList", "", true);
    formik.setFieldValue("poolSubID1", "", true);
    formik.setFieldValue("poolSubID2", "", true);
    formik.setFieldValue("poolSubID3", "", true);
    formik.setFieldValue("poolFromName", "", true);
    formik.setFieldValue("poolSubjectLine", "", true);
    formik.setFieldValue("poolFromEmail", "", true);
    formik.setFieldValue("poolEmailHeader", "", true);
    formik.setFieldValue("poolSuppression", [], true);
  };
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
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
          <Typography variant="h4">Email Form</Typography>
        </div>
        <FormControl component="fieldset">
          <RadioGroup
            row
            name="sendEmailType"
            value={formik.values.sendEmailType}
            onChange={(e) => {
              setSwitchPool(e.target.value);
              if (formik.values.sendEmailType !== "campaign") {
                resetCampaignForm();
              } else {
                resetPoolForm();
              }
              formik.handleChange(e);
            }}
          >
            <FormControlLabel
              value="campaign"
              control={<Radio />}
              label="Campaign"
              // onChange={() => {
              //   formik.resetForm();
              //   dispatch(setFormData(null));
              //   // formik.setValues('sendEmailType')
              // }}
            />
            <FormControlLabel
              value="pool"
              control={<Radio />}
              label="Pool"
              // onChange={() => {
              //   formik.resetForm();
              //   dispatch(setFormData(null));

              // }}
            />
          </RadioGroup>
        </FormControl>
        {formik.values.sendEmailType === "campaign" && (
          <>
            <div>
              <Autocomplete
                id="offerId"
                options={offerOptions}
                value={formik.values.offerId}
                getOptionLabel={(option) => (option ? option.offer_name : "")}
                onChange={(e, newValue) =>
                  formik.setFieldValue("offerId", newValue, true)
                }
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Offer ID *"
                    variant="standard"
                  />
                )}
              />
              {formik.touched.offerId && formik.errors.offerId && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.offerId}
                </div>
              )}
            </div>
            <div>
              <TextField
                fullWidth
                id="subID1"
                name="subID1"
                label="Sub ID 1"
                variant="standard"
                value={formik.values.subID1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.subID1 && Boolean(formik.errors.subID1)}
              />
              {formik.touched.subID1 && formik.errors.subID1 && (
                <div className="error">{formik.errors.subID1}</div>
              )}
            </div>

            <div>
              <TextField
                fullWidth
                id="subID2"
                name="subID2"
                label="Sub ID 2"
                variant="standard"
                value={formik.values.subID2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.subID2 && Boolean(formik.errors.subID2)}
              />
              {formik.touched.subID2 && formik.errors.subID2 && (
                <div className="error">{formik.errors.subID2}</div>
              )}
            </div>
            <div>
              <TextField
                fullWidth
                id="subID3"
                name="subID3"
                label="Sub ID 3"
                variant="standard"
                value={formik.values.subID3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.subID3 && Boolean(formik.errors.subID3)}
              />
              {formik.touched.subID3 && formik.errors.subID3 && (
                <div className="error">{formik.errors.subID3}</div>
              )}
            </div>
            <div>
              <Autocomplete
                id="espName"
                options={espNameOptions}
                value={formik.values.espName}
                disableClearable
                getOptionLabel={(option) => (option ? option.esp_name : "")}
                onChange={(e, newValue) => {
                  formik.setFieldValue("emailServiceAccount", null);
                  formik.setFieldValue("espName", newValue);
                  fetchEmailServiceAccounts(newValue?.esp_id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Esp Name *"
                    variant="standard"
                  />
                )}
              />
              {formik.touched.espName && formik.errors.espName && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.espName}
                </div>
              )}
            </div>

            <div>
              <Autocomplete
                id="emailServiceAccount"
                options={emailServiceAccountOptions}
                value={formik.values.emailServiceAccount}
                getOptionLabel={(option) => (option ? option.account_name : "")}
                onChange={(e, newValue) => {
                  formik.setFieldValue("emailServiceAccount", newValue);
                  fetchEmailDomainName(newValue?.esp_account_id, "esp");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email Service Account *"
                    variant="standard"
                  />
                )}
              />
              {formik.touched.emailServiceAccount &&
                formik.errors.emailServiceAccount && (
                  <div style={{ color: "red" }} className="error">
                    {formik.errors.emailServiceAccount}
                  </div>
                )}
            </div>

            <div>
              <TextField
                fullWidth
                id="fromName"
                name="fromName"
                label="From Name *"
                variant="standard"
                value={formik.values.fromName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fromName && formik.errors.fromName && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.fromName}
                </div>
              )}
            </div>

            <div>
              <TextField
                fullWidth
                id="subjectLine"
                name="subjectLine"
                label="Subject Line *"
                variant="standard"
                value={formik.values.subjectLine}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.subjectLine && formik.errors.subjectLine && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.subjectLine}
                </div>
              )}
            </div>
            <div>
              <TextField
                fullWidth
                id="fromDomain"
                name="fromDomain"
                label="From Domain *"
                variant="standard"
                value={formik.values.fromDomain}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fromDomain && formik.errors.fromDomain && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.fromDomain}
                </div>
              )}
            </div>
            <div>
              <TextField
                fullWidth
                id="fromEmailName"
                name="fromEmailName"
                label="From Email Name"
                variant="standard"
                value={formik.values.fromEmailName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fromEmailName &&
                  Boolean(formik.errors.fromEmailName)
                }
              />
              {formik.touched.fromEmailName && formik.errors.fromEmailName && (
                <div className="error">{formik.errors.fromEmailName}</div>
              )}
            </div>

            <div>
              <TextField
                fullWidth
                id="replyTo"
                name="replyTo"
                label="Reply TO *"
                variant="standard"
                value={formik.values.replyTo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.replyTo && formik.errors.replyTo && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.replyTo}
                </div>
              )}
            </div>

            <div>
              {/* <TextField
                fullWidth
                id="emailHeader"
                name="emailHeader"
                label="Email Header"
                variant="standard"
                value={formik.values.emailHeader}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.emailHeader &&
                  Boolean(formik.errors.emailHeader)
                }
              /> */}
              <Autocomplete
                id="emailHeader"
                options={emailHeader}
                value={formik.values.emailHeader}
                getOptionLabel={(option) => option}
                onChange={(e, newValue) => {
                  console.log(newValue.value, "newvaluee");
                  formik.setFieldValue("emailHeader", newValue, true);
                }}
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email Header "
                    variant="standard"
                  />
                )}
              />
              {formik.touched.emailHeader && formik.errors.emailHeader && (
                <div className="error">{formik.errors.emailHeader}</div>
              )}
            </div>
            <div>
              <Autocomplete
                multiple
                id="suppression"
                name="suppression"
                value={formik.values.suppression}
                options={suppression}
                getOptionLabel={(option) =>
                  `${option.list_name} (${option.list_type}) (${option.list_data_type})`
                }
                onChange={(e, newValue) => {
                  formik.setFieldValue("suppression", newValue, true);
                }}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Suppresion *"
                  />
                )}
              />
              {formik.touched.suppression && formik.errors.suppression && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.suppression}
                </div>
              )}
            </div>
            {console.log(templateOptions, "templateOptions...")}
            <div>
              <div style={{ display: "flex" }}>
                <Autocomplete
                  sx={{
                    width: "90%",
                  }}
                  id="templateList"
                  options={templateOptions}
                  value={formik.values.templateList}
                  getOptionLabel={(option) =>
                    option ? option.template_name : ""
                  }
                  onChange={(e, newValue) =>
                    formik.setFieldValue("templateList", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Template  *"
                      variant="standard"
                    />
                  )}
                />
                <LightTooltip title="View">
                  <IconButton
                    onClick={() => {
                      console.log("preview click");
                      setModalOpen(true);
                    }}
                    disabled={!formik.values.templateList?.template_html}
                    sx={{ paddingTop: "24px" }}
                  >
                    <Icon
                      style={{
                        color: formik.values.templateList?.template_html
                          ? "black"
                          : "lightgray",
                      }}
                      path={mdiEyeCircleOutline}
                      size={1}
                    />
                  </IconButton>
                </LightTooltip>
              </div>
              {formik.touched.templateList && formik.errors.templateList && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.templateList}
                </div>
              )}
            </div>
          </>
        )}
        {formik.values.sendEmailType === "pool" && (
          <>
            <div>
              <Autocomplete
                id="poolOfferId"
                options={poolOfferList}
                value={formik.values.poolOfferId}
                getOptionLabel={(option) => (option ? option.poolName : "")}
                onChange={(e, newValue) =>
                  formik.setFieldValue("poolOfferId", newValue, true)
                }
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Offer ID *"
                    variant="standard"
                  />
                )}
              />
              {formik.touched.poolOfferId && formik.errors.poolOfferId && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.poolOfferId}
                </div>
              )}
            </div>
            <div>
              <TextField
                fullWidth
                id="poolSubID1"
                name="poolSubID1"
                label="Sub ID 1"
                variant="standard"
                value={formik.values.poolSubID1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.poolSubID1 && Boolean(formik.errors.poolSubID1)
                }
              />
              {formik.touched.poolSubID1 && formik.errors.poolSubID1 && (
                <div className="error">{formik.errors.poolSubID1}</div>
              )}
            </div>

            <div>
              <TextField
                fullWidth
                id="poolSubID2"
                name="poolSubID2"
                label="Sub ID 2"
                variant="standard"
                value={formik.values.poolSubID2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.poolSubID2 && Boolean(formik.errors.poolSubID2)
                }
              />
              {formik.touched.poolSubID2 && formik.errors.poolSubID2 && (
                <div className="error">{formik.errors.poolSubID2}</div>
              )}
            </div>
            <div>
              <TextField
                fullWidth
                id="poolSubID3"
                name="poolSubID3"
                label="Sub ID 3"
                variant="standard"
                value={formik.values.poolSubID3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.poolSubID3 && Boolean(formik.errors.poolSubID3)
                }
              />
              {formik.touched.poolSubID3 && formik.errors.poolSubID3 && (
                <div className="error">{formik.errors.poolSubID3}</div>
              )}
            </div>
            <div>
              <Autocomplete
                id="poolEspName"
                options={poolOfferEsps}
                value={formik.values.poolEspName}
                getOptionLabel={(option) => (option ? option.poolName : "")}
                onChange={(e, newValue) => {
                  // formik.setFieldValue("emailServiceAccount", null);
                  formik.setFieldValue("poolEspName", newValue);
                  // fetchEmailServiceAccounts(newValue?.esp_id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Esp Name *"
                    variant="standard"
                    error={
                      formik.touched.poolEspName &&
                      Boolean(formik.errors.poolEspName)
                    }
                  />
                )}
              />
            </div>
            <div>
              <Autocomplete
                id="poolFromName"
                options={poolFromNameList}
                value={formik.values.poolFromName}
                getOptionLabel={(option) => (option ? option?.poolName : "")}
                onChange={(e, newValue) =>
                  formik.setFieldValue("poolFromName", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From Name  "
                    variant="standard"
                  />
                )}
              />
              {formik.touched.poolFromName && formik.errors.poolFromName && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.poolFromName}
                </div>
              )}
            </div>

            <div>
              <Autocomplete
                id="poolSubjectLine"
                options={poolSubjectLineList}
                value={formik.values.poolSubjectLine}
                getOptionLabel={(option) => (option ? option?.poolName : "")}
                onChange={(e, newValue) =>
                  formik.setFieldValue("poolSubjectLine", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subject Line  *"
                    variant="standard"
                  />
                )}
              />
              {formik.touched.poolSubjectLine &&
                formik.errors.poolSubjectLine && (
                  <div style={{ color: "red" }} className="error">
                    {formik.errors.poolSubjectLine}
                  </div>
                )}
            </div>
            <div>
              <TextField
                fullWidth
                id="poolFromEmail"
                name="poolFromEmail"
                label="From Email Name *"
                variant="standard"
                value={formik.values.poolFromEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.poolFromEmail && formik.errors.poolFromEmail && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.poolFromEmail}
                </div>
              )}
            </div>
            <div>
              <Autocomplete
                id="poolEmailHeader"
                options={poolHeaderList}
                value={formik.values.poolEmailHeader}
                getOptionLabel={(option) => (option ? option.poolName : "")}
                onChange={(e, newValue) =>
                  formik.setFieldValue("poolEmailHeader", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email Header *"
                    variant="standard"
                  />
                )}
              />

              {formik.touched.poolEmailHeader &&
                formik.errors.poolEmailHeader && (
                  <div style={{ color: "red" }} className="error">
                    {formik.errors.poolEmailHeader}
                  </div>
                )}
            </div>
            <div>
              <Autocomplete
                multiple
                id="poolSuppression"
                name="poolSuppression"
                value={formik.values.poolSuppression}
                options={suppression}
                filterSelectedOptions
                getOptionLabel={(option) =>
                  `${option.list_name} (${option.list_type}) (${option.list_data_type})`
                }
                onChange={(e, newValue) => {
                  formik.setFieldValue("poolSuppression", newValue, true);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Suppresion *"
                  />
                )}
              />
              {formik.touched.poolSuppression &&
                formik.errors.poolSuppression && (
                  <div style={{ color: "red" }} className="error">
                    {formik.errors.poolSuppression}
                  </div>
                )}
            </div>

            <div>
              <Autocomplete
                id="poolTemplateList"
                options={poolTemplateList}
                value={formik.values.poolTemplateList}
                getOptionLabel={(option) => (option ? option.poolName : "")}
                onChange={(e, newValue) =>
                  formik.setFieldValue("poolTemplateList", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Template *"
                    variant="standard"
                  />
                )}
              />
              {formik.touched.poolTemplateList &&
                formik.errors.poolTemplateList && (
                  <div style={{ color: "red" }} className="error">
                    {formik.errors.poolTemplateList}
                  </div>
                )}
            </div>
          </>
        )}

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {formik.values.sendEmailType === "campaign" && (
            <>
              <TextField
                sx={{ mt: 2 }}
                variant="standard"
                multiline
                rows={3}
                placeholder="Enter your email here... 
                        Use New Line (↵) For Separator"
                fullWidth
                id="emails"
                name="emails"
                value={inputValue || null}
                onChange={(e) => {
                  formik.handleChange(e);
                  setInputValue(e.target.value);
                }}
              />
              {formik.touched.emails && formik.errors.emails && (
                <div style={{ color: "red" }} className="error">
                  {formik.errors.emails}
                </div>
              )}
            </>
          )}

          <div></div>
          <br />
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => {
                formik.values.sendEmailType === "campaign"
                  ? handleValidateSchema("campaignSubmit")
                  : handleValidateSchema("poolSubmit");
                setSentMail(false);
              }}
              sx={{ mt: 1 }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
            {formik.values.sendEmailType === "campaign" && (
              <>
                <Button
                  value={sentMail}
                  onClick={() => {
                    // debugger;
                    handleValidateSchema("test");
                    createArray();
                  }}
                  type="submit"
                  variant="outlined"
                >
                  Test Email
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                if (formik.values.sendEmailType === "campaign") {
                  resetCampaignForm();
                } else {
                  resetPoolForm();
                }
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </form>
      <PreviewModal
        open={modalOpen}
        handleClose={handleClose}
        htmlContent={formik?.values?.templateList?.template_html}
      />
    </Box>
  );
};
