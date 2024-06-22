import { Box, Button, Drawer, TextField } from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/joy";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-spellcheck";
import "ace-builds/webpack-resolver";
import { useRef } from "react";
import { useEffect } from "react";
import axiosInstance from "helpers/apiService";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { mdiFileDocument } from "@mdi/js";
import Icon from "@mdi/react";
import apiEndPoints from "helpers/APIEndPoints";
import { addTemplate, templateUpdate } from "services/presets/template";
import Image from "./image";
const validationSchema = Yup.object().shape({
  templateName: Yup.string()
    .trim()
    .required("Template Name  required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
  verticals: Yup.mixed().required("  Vertical name is required"),
  templatehtml: Yup.mixed().required("Template content is required"),
});

const TemplateDrawer = ({
  openActive,
  setOpenActive,
  defaultValues,
  getDataRender,
}) => {
  const aceEditorRef = useRef();
  const [verticalName, setVerticalName] = useState([]);
  const [editorVisible, setEditorVisible] = useState(true);
  const [emailTags, setEmailTags] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const defaultValueslength = defaultValues
    ? Object?.keys(defaultValues)?.length
    : 0;
  const formik = useFormik({
    initialValues: {
      templateName: "",
      templatehtml: "",
      templatetext: "",
      verticals: [] || null,
      htmlCode: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const data = {
        templateDetails: {
          template_name: values?.templateName.trim(),
          vertical_id: values?.verticals.map((e) => e?.vertical_name),
          template_html: values?.templatehtml,
          template_text: values?.templatetext,
          created_by: createdBy,
          creator_name: createdByName,
        },
      };
      console.log("Form data submitted:", values);
      if (defaultValueslength === 0) {
        getData(data);
        setButtonDisabled(true);
      } else {
        getUpdateData(data);
        setButtonDisabled(true);
      }
    },
  });
  const serializedObject = localStorage?.getItem("userInfo");
  const myObject = JSON.parse(serializedObject);
  var createdByName = myObject.name;
  var createdBy = myObject.id;

  function removeStyleTag(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");

    var styleTags = doc.querySelectorAll("style");
    styleTags.forEach(function (styleTag) {
      styleTag.parentNode.removeChild(styleTag);
    });

    return doc?.documentElement?.innerHTML?.replace(/<\/?[^>]+(>|$)/g, "");
  }

  useEffect(() => {
    if (defaultValueslength > 0) {
      const {
        vertical_id,
        vertical_names,
        template_name,
        template_html,
        template_text,
      } = defaultValues;
      if (defaultValueslength > 0 && vertical_id) {
        const verticalNameArray = vertical_names?.split(",") || [];
        const verticalIdArray = JSON.parse(vertical_id) || [];
        const verticalDetailsModified = verticalIdArray.map((id, index) => ({
          vertical_name: verticalNameArray[index],
          id: parseInt(id),
        }));

        formik.setFieldValue("verticals", verticalDetailsModified);
      }
      setFieldValue(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);

  const setFieldValue = () => {
    const {
      vertical_id,
      vertical_names,
      template_name,
      template_html,
      template_text,
    } = defaultValues;
    formik.setFieldValue("templateName", template_name);
    formik.setFieldValue("templatehtml", template_html);
    formik.setFieldValue("templatetext", template_text);
    formik.setFieldValue("htmlCode", template_html);
    setTimeout(() => {
      formik.validateField("templateName");
    }, 0);
  };

  const getData = async (data) => {
    try {
      const res = await addTemplate(data);
      if (res) {
        setOpenActive({ drawer: false });
        getDataRender();
      }
      setButtonDisabled(false);
    } catch (error) {
      setButtonDisabled(false);
    }
  };
  const getUpdateData = async (data) => {
    try {
      const res = await templateUpdate(defaultValues?.id, data);
      if (res) {
        setOpenActive({ drawer: false });
      }
      setButtonDisabled(false);
      getDataRender();
    } catch (error) {
      setButtonDisabled(false);
    }
  };
  useEffect(() => {
    getVerticalName();
    getEmailTags();
  }, []);
  useEffect(() => {
    const cleanedHtmlCode = removeNewlines(formik?.values?.htmlCode);
    formik.setFieldValue("templatehtml", cleanedHtmlCode);
    formik.setFieldValue(
      "templatetext",
      removeStyleTag(formik.values.htmlCode)
      // formik?.values?.htmlCode?.replace(/<\/?[^>]+(>|$)/g, "")
    );
  }, [formik.values?.htmlCode]);

  const onEditorChange = (newValue) => {
    formik.setFieldValue("htmlCode", newValue);
  };

  const removeNewlines = (inputString) => {
    return inputString?.replace(/\n/g, "");
  };

  const getVerticalName = async () => {
    try {
      const { data } = await axiosInstance.get(
        apiEndPoints.getAllVerticalNames
      );
      setVerticalName(data.result);
    } catch (error) {
      enqueueSnackbar(`error`, {
        variant: "error",
      });
    }
  };
  const getEmailTags = async () => {
    try {
      const { data } = await axiosInstance.get(apiEndPoints.emailTags);
      setEmailTags(data);
    } catch (error) {
      enqueueSnackbar(`error`, {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Drawer anchor="right" open={openActive}>
        <Box
          sx={{ m: 1, width: "90vw", margin: "24px" }}
          noValidate
          autoComplete="off"
        >
          <div>
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{ display: " flex", alignItems: "center", width: "100%" }}
              >
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "1.3rem",
                    mt: 4,
                    width: "100%",
                  }}
                >
                  Add Email Template
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "1.3rem",
                    mt: 4,
                    width: "83%",
                    
                  }}
                >
                  Upload Image
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", width: "100%", alignItems: "center" }}
              >
                <Box sx={{ width: "50%", mr: 4 , mt:2}}>
                  <div>
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ marginBottom: 1 }}
                      variant="outlined"
                      label="Template Name"
                      name="templateName"
                      value={formik.values.templateName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.templateName &&
                      formik.errors.templateName && (
                        <div style={{ color: "red" }}>
                          {formik.errors.templateName}
                        </div>
                      )}
                  </div>
                </Box>
                <Box sx={{ width: "50%" }}>
                  <div>
                    <Image />
                  </div>
                </Box>
              </Box>

              <Box sx={{ height: "560px", mt: 3 }}>
                <Box sx={{ display: "flex", gap: "20px" }}>
                  <Typography>Template</Typography>
                  <Icon
                    onClick={() => {
                      setEditorVisible((prevVisible) => !prevVisible);
                    }}
                    path={mdiFileDocument}
                    size={1.2}
                  />
                </Box>
                {editorVisible ? (
                  <Box
                    sx={{
                      display: "flex",
                      height: "550px",
                      width: "100vw",
                      overflowY: "scroll",
                      overflowX: "hidden",
                      border: "1px solid grey",
                    }}
                  >
                    <Box
                      sx={{
                        width: "50%",
                        overflow: "scroll",
                      }}
                    >
                      <AceEditor
                        mode="html"
                        theme="monokai"
                        name="templatehtml"
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
                    <div
                      style={{ width: "50%", overflow: "scroll" }}
                      dangerouslySetInnerHTML={{
                        __html: formik?.values?.htmlCode,
                      }}
                    ></div>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      height: "550px",
                      width: "100%",
                      overflowY: "scroll",
                      overflowX: "hidden",
                      border: "1px solid grey",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: removeStyleTag(formik.values.htmlCode),
                      }}
                    ></div>

                    {console.log(removeStyleTag(formik.values.htmlCode))}
                  </Box>
                )}

                {formik.touched.templatehtml && formik.errors.templatehtml && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {formik.errors.templatehtml}
                  </div>
                )}
              </Box>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ marginTop: "70px" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpenActive({ drawer: false });
                      setFieldValue(defaultValues);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isButtonDisabled}
                    sx={{ ml: "30px" }}
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Box>
                <Box sx={{ marginTop: "20px" }}>
                  <Box sx={{ marginTop: "20px" }}>
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
                </Box>
              </div>
            </form>
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default TemplateDrawer;
