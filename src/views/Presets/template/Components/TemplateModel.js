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
const validationSchema = Yup.object().shape({
  templateName: Yup.string()
    .trim()
    .required("Template Name  required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
  verticals: Yup.mixed().required("  Vertical name is required"),
  templatehtml: Yup.mixed().required("Template content is required"),
});

const TemplateModel = ({
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
        },
      };
      console.log("Form data submitted:", values);
      if (defaultValueslength === 0) {
        setButtonDisabled(true);
      } else {
        // getUpdateData(data);
        setButtonDisabled(true);
      }
    },
  });
  const serializedObject = localStorage?.getItem("userInfo");
  const myObject = JSON.parse(serializedObject);
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
      const { vertical_id, vertical_names } = defaultValues;
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
    const { template_name, template_html, template_text } = defaultValues;
    formik.setFieldValue("templateName", template_name);
    formik.setFieldValue("templatehtml", template_html);
    formik.setFieldValue("templatetext", template_text);
    formik.setFieldValue("htmlCode", template_html);
    setTimeout(() => {
      formik.validateField("templateName");
    }, 0);
  };

  useEffect(() => {
    const cleanedHtmlCode = removeNewlines(formik?.values?.htmlCode);
    formik.setFieldValue("templatehtml", cleanedHtmlCode);
    formik.setFieldValue(
      "templatetext",
      removeStyleTag(formik.values.htmlCode)
      // formik?.values?.htmlCode?.replace(/<\/?[^>]+(>|$)/g, "")
    );
  }, [formik.values?.htmlCode]);

  const removeNewlines = (inputString) => {
    return inputString?.replace(/\n/g, "");
  };

  return (
    <>
      <Drawer anchor="right" open={openActive}>
        <Box sx={{ m: 1, margin: "24px" }} noValidate autoComplete="off">
          <div>
            <form onSubmit={formik.handleSubmit}>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "1.3rem",
                  // mt: 4,
                  width: "40vw",
                }}
              >
                Template Preview
              </Typography>

              <Box sx={{ marginTop: "30px", height: "560px" }}>
                {editorVisible ? (
                  <Box
                    sx={{
                      display: "flex",
                      height: "580px",
                      width: "40vw",
                      overflowY: "scroll",
                      overflowX: "hidden",
                      border: "1px solid grey",
                    }}
                  >
                    <div
                      style={{ width: "100%", overflow: "scroll" }}
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
                      width: "40vw",
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
              </Box>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ marginTop: "40px" }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenActive({ drawer: false });
                      setFieldValue(defaultValues);
                    }}
                  >
                    Close
                  </Button>
                  {/* <Button
                    sx={{ ml: "30px" }}
                    variant="contained"
                    onClick={() => {
                      setOpenActive({ drawer: false });
                      setFieldValue(defaultValues);
                    }}
                  >
                    Submit
                  </Button> */}
                </Box>
              </div>
            </form>
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default TemplateModel;
