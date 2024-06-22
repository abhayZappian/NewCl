import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Drawer,
  TextField,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { Typography } from "@mui/joy";
import { useEffect } from "react";
import axiosInstance from "helpers/apiService";
import { baseURL } from "config/envConfig";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCountryList } from "store/selectors";
import { setCountryList } from "store/action/journeyCanvas";
import { enqueueSnackbar } from "notistack";


const validationSchema = Yup.object().shape({
  verticalName: Yup.mixed().required("vertical Name is required"),
  contacts: Yup.array().of(
    Yup.object().shape({
      subVerticalName: Yup.mixed().required("sub Vertical Name is required"),
      country: Yup.mixed().required("Country Name is required"),
    })
  ),
});

const SubVerticalDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  defaultValues,
}) => {
  const [verticalName, setverticalname] = useState([]);
  const [receivedData, setReceivedData] = useState({});
  const Dispatch = useDispatch();
  const countryList = useSelector(selectCountryList) || [];
  // const defaultValueslength = Object?.keys(defaultValues)?.length;
  console.log(defaultValues);
  const defaultValueslength = defaultValues
    ? Object?.keys(defaultValues)?.length
    : 0;
  console.log(defaultValueslength, "ccc");

  console.log(receivedData, "ttt");

  const getCountry = async () => {
    try {
      const response = await axiosInstance.get(`${baseURL}/getAllCountries`);
      console.log(countryList, "rdeux...........");
      console.log(response);
      Dispatch(setCountryList(response.data.allCountries));
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  const getVerticalNames = async () => {
    try {
      const response = await axiosInstance.get(
        `${baseURL}/getAllVerticalNames`
      );
      console.log(response.data.result, "vertival nAME........");
      setverticalname(response.data.result);
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  //   const getData = async (values) => {
  //     const data = {
  //         created_by: createdBy,
  //         creator_name: createdByName,
  //         vertical_name: values.vertical_name
  //     };
  //     const { res } = await axiosInstance.post(`${baseURL}/addVerticalName/`, data);
  //     enqueueSnackbar('Form Submit Successfully !!!', {
  //         variant: 'success'
  //     });
  //     setIsDrawerOpen(false);
  // };

  useEffect(() => {
    if (countryList.length === 0) {
      getCountry();
    }
    getVerticalNames();
  }, []);
  useEffect(() => {
    setReceivedData(defaultValues);
    if (defaultValues !== undefined && Object.keys(defaultValues).length) {
      console.log(defaultValues);
      formik.setFieldValue("verticalName", defaultValues?.vertical_name);
      let country;
      if (defaultValues?.countryId === 1) {
        country = "IND";
      }
      formik.setFieldValue("contacts[0].country", country);
      formik.setFieldValue(
        "contacts[0].subVerticalName",
        defaultValues?.category
      );
    }
  }, [defaultValues]);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const serializedObject = localStorage?.getItem("userInfo");
  const myObject = JSON.parse(serializedObject);
  var createdByName = myObject.name;
  var createdBy = myObject.id;

  const getdata = async (values) => {
    // debugger;
    const data = {
      verticalName: values.verticalName,
      createdBy: createdBy,
      creatorName: createdByName,
      subVerticalDetails: values.contacts,
    };
    const response = await axiosInstance.post(
      `${baseURL}/addSubVerticalDetails/`,
      data
    );
    console.log(response, "rawawer");
    if (response.status === 200) {
      const { data } = await axiosInstance.get(
        `${baseURL}/allSubVerticalDetails`
      );
      console.log(data.result, "sub verytical drawer....................");
      // setAllSubVerticalNames(data.result)
    }
    enqueueSnackbar("Form Submit Successfully !!!", {
      variant: "success",
    });
    setIsDrawerOpen(false);
    // closeDrawer()
  };
  const getUpdateData = async (values) => {
    console.log(values);
    const data = {
      verticalName: values.verticalName,
      countryId: values.contacts[0].country,
      editBy: createdBy,
      editor_name: createdByName,
      subVerticalName: values.contacts[0].subVerticalName,
    };
    console.log(receivedData);
    const { res } = await axiosInstance.put(
      `${baseURL}/updateSubVerticalDetails/${receivedData?.category_id}`,
      data
    );
    enqueueSnackbar("Form Submit Successfully !!!", {
      variant: "success",
    });
    setIsDrawerOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      verticalName: "",
      contacts: [{ subVerticalName: null, country: [] }],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form data submitted:", values);
      if (defaultValueslength === 0) {
      getdata(values);
      } else {
        getUpdateData(values);
      }
    },
  });
  return (
    <>
      <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
        {/* {console.log(setIsDrawerOpen, "setIsDrawerOpen,,,,,,,,,,,,,,,,,,,,")}
        {console.log(setAllSubVerticalNames, "setIsDrawerOpen,,,,,,,,,,,,,,,,,,,,")} */}

        <Box
          sx={{ m: 1, width: "350px", margin: "24px" }}
          noValidate
          autoComplete="off"
        >
          <div>
            <Typography level="h4"> Add Sub Vertical</Typography>
          </div>
          <div>
            <Box>
              <form onSubmit={formik.handleSubmit}>
                <div style={{ marginTop: "10px" }}>
                  <Autocomplete
                    sx={{ marginTop: 1 }}
                    id="verticalName"
                    name="verticalName"
                    // options={["a", "b"]}
                    options={verticalName.map((e) => e.vertical_name)}
                    value={formik.values.verticalName}
                    onChange={(e, newValue) => {
                      formik.setFieldValue("verticalName", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Vertical Name"
                        variant="standard"
                      />
                    )}
                  />
                  {formik.errors.verticalName && (
                    <div style={{ color: "red" }}>
                      {formik.errors.verticalName}
                    </div>
                  )}
                </div>
                {formik.values.contacts.map((contact, index) => (
                  <div key={index}>
                    <Card
                      sx={{
                        position: "relative",
                        border: "2px solid #d1cfcf",
                        pb: 3,
                        marginTop: 3,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <CardContent>
                        <Box>
                          <TextField
                            id={`subVerticalName-${index}`}
                            name={`contacts[${index}].subVerticalName`}
                            label="Sub Vertical Name"
                            variant="standard"
                            fullWidth
                            value={contact.subVerticalName || ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          ></TextField>
                          {formik.touched.contacts &&
                            formik.touched.contacts[index] &&
                            formik.errors.contacts?.[index]
                              ?.subVerticalName && (
                              <div style={{ color: "red" }}>
                                {
                                  formik.errors.contacts?.[index]
                                    ?.subVerticalName
                                }
                              </div>
                            )}
                        </Box>

                        <Box>
                          {console.log(countryList)}
                          <Autocomplete
                            fullWidth
                            id={`contacts${index}`}
                            // options={countryList.map((e) => e.countryName)}
                            options={countryList}
                            getOptionLabel={(option) =>
                              `${option.countryName} `
                            }
                            value={countryList.countryId}
                            onChange={(event, newValue) => {
                              console.log(newValue, "valuess");
                              formik.setFieldValue(
                                `contacts[${index}].country`,
                                1
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                variant="standard"
                                {...params}
                                label="Country"
                              />
                            )}
                          />
                          {formik.touched.contacts &&
                            formik.touched.contacts[index] &&
                            formik.errors.contacts?.[index]?.country && (
                              <div style={{ color: "red" }}>
                                {formik.errors.contacts?.[index]?.country}
                              </div>
                            )}
                        </Box>
                      </CardContent>

                      <Box sx={{ marginTop: "10px" }}>
                        {index > 0 && (
                          <div
                            style={{
                              top: "-7px",
                              right: "-21px",
                              position: "absolute",
                            }}
                          >
                            <Button
                              sx={{
                                "&:hover": {
                                  backgroundColor: "transparent",
                                },
                              }}
                              onClick={() =>
                                formik.values.contacts.length > 1 &&
                                formik.setFieldValue(
                                  "contacts",
                                  formik.values.contacts.filter(
                                    (_, i) => i !== index
                                  )
                                )
                              }
                              type="button"
                            >
                              <CancelIcon />
                            </Button>
                          </div>
                        )}
                      </Box>
                      {/* </Box> */}
                    </Card>
                  </div>
                ))}
                <Button
                  sx={{ mt: 3 }}
                  variant="outlined"
                  type="button"
                  onClick={() =>
                    formik.setFieldValue("contacts", [
                      ...formik.values.contacts,
                      { subVerticalName: null, country: null },
                    ])
                  }
                >
                  <AddIcon />
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Box>
              </form>
            </Box>
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default SubVerticalDrawer;
