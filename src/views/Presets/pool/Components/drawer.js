import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { createdByName, createdBy } from "../../../../helpers/userInfo";
import {
  addPool,
  getESAdetails,
  getESPdetails,
  getHeaderDetails,
  getOffersDetails,
  getPoolTypeDetails,
  getTemplateDetails,
  updatePoolDetails,
} from "services/presets/pool";

const validateArrayField = (label, values, selectedOption) =>
  Yup.array()
    .of(
      Yup.mixed().required(
        `Each ${label} is required when ${selectedOption} is selected`
      )
    )
    .when("selectedOption", {
      is: selectedOption,
      then: Yup.array().min(
        1,
        `At least one ${label} is required when ${selectedOption} is selected`
      ),
    });

const validationSchema = Yup.object().shape({
  selectedOption: Yup.mixed().required("Please select an option"),
  poolName: Yup.string()
    .trim()
    .required("Pool name  required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
  SubjectLine: Yup.mixed().when("selectedOption", {
    is: "Subject Lines",
    then: Yup.string()
      .trim()
      .required("This field is required when subject lines is selected")
      .matches(
        /^[^\s]+(\s[^\s]+)*$/,
        "Only one space is allowed between words "
      ),
  }),
  Template: validateArrayField("template", Yup.mixed(), "Templates"),
  Offer: validateArrayField("offer", Yup.mixed(), "Offers"),
  FromName: Yup.mixed().when("selectedOption", {
    is: "From Names",
    then: Yup.string()
      .trim()
      .required("This field is required when from names is selected"),
  }),

  Header: validateArrayField("Header", Yup.mixed(), "Headers"),
  dropdowns: Yup.array().when(
    ["ESP", "selectedOption"],
    (ESP, selectedOption, schema) => {
      if (selectedOption === "Esps") {
        return schema.of(
          Yup.object().shape({
            option1: Yup.mixed().required("Please select ESP"),
            option2: Yup.mixed().required(
              "Please select email service account"
            ),
          })
        );
      }
      return schema;
    }
  ),
});

const FooterDrawer = ({
  openActive,
  setOpenActive,
  defaultValues,
  getDataRender,
  setDefaultValues,
}) => {
  const [template, setTemplate] = useState([]);
  const [offers, setOffers] = useState([]);
  const [esp, setESP] = useState([]);
  const [header, setHeader] = useState([]);
  const [esa, setESA] = useState([]);
  const [poolType, setPoolType] = useState([]);
  const [receivedData, setReceivedData] = useState({});
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const defaultValueslength = Object.keys(defaultValues).length;

  const getTemplateData = async () => {
    const data = await getTemplateDetails();
    setTemplate(data?.data);
  };

  const getPoolType = async () => {
    const data = await getPoolTypeDetails();
    setPoolType(data?.data?.results);
  };

  const getOffersData = async () => {
    const data = await getOffersDetails();
    setOffers(data?.data);
  };

  const getESP = async () => {
    const data = await getESPdetails();
    setESP(data.data);
  };

  const getESA = async (id) => {
    const data = await getESAdetails(id);
    setESA(data.data);
  };

  const getHeader = async () => {
    const data = await getHeaderDetails();
    setHeader(data?.data?.result);
  };
  useEffect(() => {
    setReceivedData(defaultValues);
    if (defaultValues && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);

  const setFieldValues = (values) => {
    formik.setFieldValue("poolName", values?.poolName);
    formik.setFieldValue("selectedOption", values?.poolType);
    setTimeout(() => {
      formik.validateField("poolName");
    }, 0);
    switch (values?.poolType) {
      case "Subject Lines":
        formik.setFieldValue(
          "SubjectLine",
          values?.subjectLines?.subjects.join("\n")
        );
        break;
      case "Templates":
        formik.setFieldValue("Template", values?.templates?.template);
        break;
      case "Offers":
        formik.setFieldValue("Offer", values?.offers?.offer);
        break;
      case "From Names":
        formik.setFieldValue(
          "FromName",
          Array.isArray(values?.fromNames?.fromName)
            ? values?.fromNames?.fromName.join("\n")
            : ""
        );
        break;
      case "Esps":
        formik.setFieldValue("dropdowns", values?.esps?.esp);
        break;
      case "Headers":
        formik.setFieldValue("Header", values?.headers?.header);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getTemplateData();
    getOffersData();
    getHeader();
    getESP();
    getPoolType();
  }, []);

  const createPool = async (data) => {
    try {
      await addPool(data);
      setOpenActive(false);
      setTimeout(() => {
        formik.resetForm();
      }, 1000);
      setDefaultValues({});
      formik.resetForm();
      setButtonDisabled(false);
      getDataRender();
    } catch (error) {
      setButtonDisabled(false);
    }
  };
  const updatePool = async (data) => {
    try {
      await updatePoolDetails(receivedData?._id, data);
      setOpenActive(false);
      setTimeout(() => {
        formik.resetForm();
      }, 1000);
      setDefaultValues({});
      formik.resetForm();
      setButtonDisabled(false);
      getDataRender();
    } catch (error) {
      setButtonDisabled(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      poolName: "",
      selectedOption: "",
      SubjectLine: "",
      Template: [],
      Offer: [],
      FromName: "",
      ESP: [],
      Header: [],
      dropdowns: [{ option1: null, option2: null }],
    },
    validationSchema,
    onSubmit: (values) => {
      const sanitizedSubjectLine = values.SubjectLine.split("\n").map(
        (email) =>
          `${email
            .trim()
            .replace(/\s{5,}/g, "")
            .replace(/\s/g, " ")} `
      );

      const sanitizedFromName = values.FromName.split("\n").map(
        (email) =>
          `${email
            .trim()
            .replace(/\s{5,}/g, "")
            .replace(/\s/g, " ")} `
      );
      const data = {
        poolname: values?.poolName.trim(),
        poolType: values?.selectedOption,
        subjectLines: {
          subjects: sanitizedSubjectLine,
        },
        templates: { template: values?.Template },
        esps: { esp: values?.dropdowns },
        offers: { offer: values?.Offer },
        fromNames: {
          fromName: sanitizedFromName,
        },
        headers: { header: values?.Header },
        createdBy: createdBy,
        createdByName: createdByName,
      };
      if (defaultValueslength === 0) {
        createPool(data);
        setButtonDisabled(true);
      } else {
        updatePool(data);
        setButtonDisabled(true);
      }
    },
  });
  const closeDrawer = () => {
    setOpenActive({ drawer: false });
    formik.setTouched({}, false);
    formik.setErrors({}, false);
  };

  const handleAddDropdown = () => {
    formik.setValues({
      ...formik.values,
      dropdowns: [...formik.values.dropdowns, { option1: null, option2: null }],
    });
  };

  const handleRemoveDropdown = (index) => {
    const updatedDropdowns = [...formik.values.dropdowns];
    updatedDropdowns.splice(index, 1);
    formik.setValues({
      ...formik.values,
      dropdowns: updatedDropdowns,
    });
  };

  return (
    <Drawer anchor="right" open={openActive}>
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
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "1.3rem",
              mt: 4,
            }}
          >
            Add Pool
          </Typography>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={{ mt: 3 }}
            id="poolName"
            name="poolName"
            label="Enter Pool Name "
            variant="standard"
            fullWidth
            value={formik.values.poolName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.poolName && formik.errors.poolName)}
            helperText={formik.touched.poolName && formik.errors.poolName}
          />
          <Autocomplete
            id="selectedOption"
            name="selectedOption"
            disableClearable
            options={poolType}
            sx={{ mt: 2 }}
            value={formik.values.selectedOption || ""}
            onChange={(_, newValue) => {
              formik.setFieldValue("selectedOption", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Select a Pool Type"
                error={
                  formik.touched.selectedOption &&
                  Boolean(formik.errors.selectedOption)
                }
                helperText={
                  formik.touched.selectedOption && formik.errors.selectedOption
                }
              />
            )}
          />
          {formik.values.selectedOption === "Subject Lines" && (
            <TextField
              sx={{ mt: 2 }}
              id="SubjectLine"
              name="SubjectLine"
              label="Enter Subject Line Here"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.SubjectLine}
              error={
                formik.touched.SubjectLine && Boolean(formik.errors.SubjectLine)
              }
              helperText={
                formik.touched.SubjectLine && formik.errors.SubjectLine
              }
            />
          )}
          {formik.values.selectedOption === "Templates" && (
            <Autocomplete
              multiple
              id="Template"
              name="Template"
              disableClearable
              options={template}
              getOptionLabel={(option) => option.template_name}
              getOptionValue={(option) => option.id}
              value={formik.values.Template}
              onChange={(_, newValue) => {
                formik.setFieldValue("Template", newValue);
              }}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select a Template"
                  error={
                    formik.touched.Template && Boolean(formik.errors.Template)
                  }
                  helperText={formik.touched.Template && formik.errors.Template}
                />
              )}
            />
          )}

          {formik.values.selectedOption === "Offers" && (
            <Autocomplete
              multiple
              disablePortal
              id="Offer"
              name="Offer"
              disableClearable
              options={offers}
              getOptionLabel={(option) => option.offer_name}
              getOptionValue={(option) => option.offer_id}
              value={formik.values.Offer}
              onChange={(_, newValue) => {
                formik.setFieldValue("Offer", newValue);
              }}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select a Offer"
                  error={formik.touched.Offer && Boolean(formik.errors.Offer)}
                  helperText={formik.touched.Offer && formik.errors.Offer}
                />
              )}
            />
          )}
          {formik.values.selectedOption === "From Names" && (
            <TextField
              sx={{ mt: 2 }}
              id="FromName"
              name="FromName"
              label="Enter From Name Here"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.FromName}
              error={formik.touched.FromName && Boolean(formik.errors.FromName)}
              helperText={formik.touched.FromName && formik.errors.FromName}
            />
          )}
          {formik.values.selectedOption === "Esps" && (
            <>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Card
                  sx={{
                    position: "relative",
                    border: "2px solid #D1CFCF",
                    pb: 3,
                    marginTop: 3,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <CardContent>
                    {formik.values.dropdowns.map((dropdown, index) => (
                      <div key={index} sx={{ mt: 4 }}>
                        <Autocomplete
                          fullWidth
                          disableClearable
                          options={esp}
                          onBlur={formik.handleBlur}
                          getOptionLabel={(option) => option.esp_name}
                          value={dropdown.option1 || null}
                          onChange={(_, value) => {
                            formik.setFieldValue(
                              `dropdowns[${index}].option1`,
                              value
                            );
                            formik.setFieldValue(
                              `dropdowns[${index}].option2`,
                              null
                            );
                            getESA(value?.esp_id);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label={`Esp Name`}
                              error={
                                formik.touched.dropdowns &&
                                formik.errors.dropdowns?.[index]?.option1
                              }
                              helperText={
                                formik.touched.dropdowns &&
                                formik.errors.dropdowns?.[index]?.option1
                              }
                            />
                          )}
                        />
                        <Autocomplete
                          fullWidth
                          options={esa}
                          disableClearable
                          value={dropdown.option2 || null}
                          getOptionLabel={(option) => option.account_name}
                          onChange={(_, value) =>
                            formik.setFieldValue(
                              `dropdowns[${index}].option2`,
                              value
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label={`Email Service Account`}
                              error={
                                formik.touched.dropdowns &&
                                formik.errors.dropdowns?.[index]?.option2
                              }
                              helperText={
                                formik.touched.dropdowns &&
                                formik.errors.dropdowns?.[index]?.option2
                              }
                            />
                          )}
                        />
                        {index > 0 ? (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveDropdown(index)}
                            sx={{ mt: 2 }}
                          >
                            <CancelIcon />
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={handleAddDropdown}
                    sx={{ mt: 2 }}
                  >
                    <AddIcon />
                  </Button>
                </div>
              </Box>
            </>
          )}
          {console.log(header)}
          {formik.values.selectedOption === "Headers" && (
            <Autocomplete
              multiple
              id="Header"
              name="Header"
              options={header}
              getOptionLabel={(option) => option.header_name}
              getOptionValue={(option) => option.id}
              value={formik.values.Header}
              onChange={(_, newValue) => {
                formik.setFieldValue("Header", newValue);
              }}
              filter
              getOptionDisabled={(option) =>
                formik.values.Header.some(
                  (selectedOption) => selectedOption.id === option.id
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Select a Header"
                  error={formik.touched.Header && Boolean(formik.errors.Header)}
                  helperText={formik.touched.Header && formik.errors.Header}
                />
              )}
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => {
                closeDrawer();
                setFieldValues(defaultValues);
                formik.resetForm();
                setDefaultValues({});
              }}
            >
              Cancel
            </Button>

            <Button
              disabled={isButtonDisabled}
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};
export default FooterDrawer;
