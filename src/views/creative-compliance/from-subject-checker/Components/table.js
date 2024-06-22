import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ErrorIcon from "@mui/icons-material/Error";
import { useFormik } from "formik";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { useEffect } from "react";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import CreativeDrawer from "./drawer";
import SearchNetwork from "./searchNetwork";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import CircularLoader from "ui-component/CircularLoader";

const Table = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState({
    generalForm: false,
    seasonalForm: false,
    generalSubject: false,
    seasonalSubject: false,
  });
  const [searchopen, setSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [creativeWordsDetails, setCreativeWordsDetails] = useState({
    fromName: [],
    seasonalFromName: [],
    subjectLine: [],
    seasonalSubjectLine: [],
  });
  //console.log(creativeWordsDetails, "details");

  useEffect(() => {
    getNetworkList();
  }, []);

  const getNetworkList = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.getNetworkList);
    setData(data?.data);
  };
  const [fromNameDate, setFromNameDate] = useState("");
  const [seasonalFromNameDate, setseasonalFromNameDate] = useState("");
  const [subjectLineDate, setsubjectLineDate] = useState("");
  const [seasonalSubjectLineDate, setseasonalSubjectLineDate] = useState("");

  const creativeChecker = async (values) => {
    setIsLoading(true);
    try {
      const data = {
        networkId: values,
      };
      const res = await axiosInstance.post(apiEndPoints.textChecker, data);
      //console.log(res, "detaildd");
      //console.log(res.data.data, "datre");
      setFromNameDate(res?.data?.data?.fromNameDate);
      setseasonalFromNameDate(res?.data?.data?.seasonalFromNameDate);
      setsubjectLineDate(res?.data?.data?.subjectLineDate);
      setseasonalSubjectLineDate(res?.data?.data?.seasonalSubjectLineDate);

      //console.log(data, "dhdh");
      const {
        fromNameDate,
        seasonalFromNameDate,
        subjectLineDate,
        seasonalSubjectLineDate,
      } = res?.data?.data;
      if (
        fromNameDate === null ||
        seasonalFromNameDate === null ||
        subjectLineDate === null ||
        seasonalSubjectLineDate === null
      ) {
        //console.log(res?.data?.data, "redsa");
        enqueueSnackbar(`No Data Found`, {
          variant: "error",
        });
      } else {
        setCreativeWordsDetails({
          fromName: res?.data?.data?.fromName || [],
          seasonalFromName: res?.data?.data?.seasonalFromName || [],
          subjectLine: res?.data?.data?.subjectLine || [],
          seasonalSubjectLine: res?.data?.data?.seasonalSubjectLine || [],
        });
      }
    } catch (error) {
      throw error;
    }
    setIsLoading(false);
  };

  const red1 = creativeWordsDetails?.fromName;
  const red2 = creativeWordsDetails?.seasonalFromName;
  const red3 = creativeWordsDetails?.subjectLine;
  const red4 = creativeWordsDetails?.seasonalSubjectLine;

  const determineLineBackground = (line, redArray) => {
    return redArray.includes(line.trim()) ? "green" : "red";
  };

  const handleChange = (event, fieldName) => {
    const inputValue = event.target.value;
    formik.setFieldValue(fieldName, inputValue);
  };

  const handleClick = (Type) => {
    setOpen(true);
    //    setPreviewType(Type);
  };
  const searchOpen = () => {
    setSearchOpen(true);
  };
  const handleReset = () => {
    formik.resetForm();
    setCreativeWordsDetails({
      fromName: [],
      seasonalFromName: [],
      subjectLine: [],
      seasonalSubjectLine: [],
    });
    setFromNameDate(null);
    setseasonalFromNameDate(null);
    setsubjectLineDate(null);
    setseasonalSubjectLineDate(null);
  };

  const formatLines = (text, redArray) => {
    const text1 = text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, lineIndex) => (
        <div
          key={lineIndex}
          style={{
            color: "white",
            backgroundColor: determineLineBackground(line, redArray),
            padding: "5px",
            marginBottom: "5px",
          }}
        >
          {line}
        </div>
      ));
    //console.log(text1, "test");
    return text1;
  };

  const formik = useFormik({
    initialValues: {
      networkName: null,
      textField1: "",
      textField2: "",
      textField3: "",
      textField4: "",
    },
    onSubmit: (values) => {
      //console.log("Form data submitted:", values);
    },
  });

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container sx={{ width: "100%", p: "10px", mt: 1 }}>
            <Grid item sx={{ width: "50%", pr: 3 }}>
              <Typography variant="h3" sx={{ color: "#FFA500" }}>
                Note:- "Approved words or strings are highlighted by Green"
              </Typography>
              <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>
                NetworkName
              </Typography>
              <Autocomplete
                disablePortal
                size="small"
                options={data}
                getOptionLabel={(option) => option.label}
                sx={{ width: "100%" }}
                value={formik.values.networkName}
                onChange={(e, value) => {
                  formik.setFieldValue("networkName", value);
                  creativeChecker(value?.value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Network Name" />
                )}
              />
            </Grid>
            <Grid item sx={{ width: "50%", pl: 2 }}>
              <Box
                display="flex"
                justifyContent="flex-end"
                sx={{ color: "#FFA500" }}
              >
                <Button onClick={searchOpen} variant="contained">
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
          {isLoading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularLoader />
            </Box>
          ) : (
            <Grid container sx={{ width: "100%", p: "10px" }}>
              <Grid item xs={6} sx={{ pr: 2 }}>
                <Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h5">General Form Name</Typography>

                    <Typography variant="h5" sx={{ mb: 1, textAlign: "right" }}>
                      Last Updated Date:{" "}
                      {fromNameDate === "0000-00-00"
                        ? "Not Updated"
                        : fromNameDate}
                    </Typography>
                  </Box>
                  <TextField
                    multiline
                    rows={3}
                    id="textField1"
                    name="textField1"
                    variant="outlined"
                    fullWidth
                    value={formik.values.textField1}
                    onChange={(event) => handleChange(event, "textField1")}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pl: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      General Form Name Preview
                    </Typography>
                    <ErrorIcon
                      onClick={() => {
                        setOpen({ generalForm: true });
                      }}
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  {formik.values.textField1 ? (
                    <>{formatLines(formik.values.textField1, red1)}</>
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pr: 2, mt: 2 }}>
                <Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h5">Seasonal Form Name</Typography>
                    <Typography variant="h5" sx={{ mb: 1, textAlign: "right" }}>
                      Last Updated Date:{" "}
                      {seasonalFromNameDate === "0000-00-00"
                        ? "Not Updated"
                        : seasonalFromNameDate}
                    </Typography>
                  </Box>
                  <TextField
                    multiline
                    rows={3}
                    id="textField2"
                    name="textField2"
                    variant="outlined"
                    fullWidth
                    value={formik.values.textField2}
                    onChange={(event) => handleChange(event, "textField2")}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pl: 2, mt: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      Seasonal Form Name Preview
                    </Typography>
                    <ErrorIcon
                      onClick={() => {
                        setOpen({ seasonalForm: true });
                      }}
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  {formik.values.textField2 ? (
                    <>{formatLines(formik.values.textField2, red2)}</>
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pr: 2, mt: 2 }}>
                <Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h5">General Subject Line</Typography>
                    <Typography variant="h5" sx={{ mb: 1, textAlign: "right" }}>
                      Last Updated Date:{" "}
                      {subjectLineDate === "0000-00-00"
                        ? "Not Updated"
                        : subjectLineDate}
                    </Typography>
                  </Box>
                  <TextField
                    multiline
                    rows={3}
                    id="textField3"
                    name="textField3"
                    variant="outlined"
                    fullWidth
                    value={formik.values.textField3}
                    onChange={(event) => handleChange(event, "textField3")}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pl: 2, mt: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      General Subject Line Preview
                    </Typography>
                    <ErrorIcon
                      onClick={() => {
                        setOpen({ generalSubject: true });
                      }}
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  {formik.values.textField3 ? (
                    <>{formatLines(formik.values.textField3, red3)}</>
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pr: 2, mt: 2 }}>
                <Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h5">Seasonal Subject Line</Typography>
                    <Typography variant="h5" sx={{ mb: 1, textAlign: "right" }}>
                      Last Updated Date:{" "}
                      {seasonalSubjectLineDate === "0000-00-00"
                        ? "Not Updated"
                        : seasonalSubjectLineDate}
                    </Typography>
                  </Box>
                  <TextField
                    multiline
                    rows={3}
                    id="textField4"
                    name="textField4"
                    variant="outlined"
                    fullWidth
                    value={formik.values.textField4}
                    onChange={(event) => handleChange(event, "textField4")} // Use custom handleChange function
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pl: 2, mt: 2 }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      Seasonal Subject Line Preview
                    </Typography>
                    <ErrorIcon
                      onClick={() => {
                        setOpen({ seasonalSubject: true });
                      }}
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  {formik.values.textField4 ? (
                    <>{formatLines(formik.values.textField4, red4)}</>
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Box sx={{ width: "100%", mt: 5 }}>
                <Button
                  sx={{ width: "13%" }}
                  onClick={handleReset}
                  variant="outlined"
                >
                  Reset
                  <RotateLeftIcon sx={{ ml: 1 }} />
                </Button>
              </Box>
            </Grid>
          )}
        </form>
      </div>
      <CreativeDrawer
        open={open.generalForm}
        setOpen={setOpen}
        formType="Form Name"
        red1={red1}
      />
      <CreativeDrawer
        open={open.seasonalForm}
        setOpen={setOpen}
        formType="Seasonal Form Name"
        red1={red2}
      />
      <CreativeDrawer
        open={open.generalSubject}
        setOpen={setOpen}
        formType="General Subject Line"
        red1={red3}
      />
      <CreativeDrawer
        open={open.seasonalSubject}
        setOpen={setOpen}
        formType="Seasonal Subject Line"
        red1={red4}
      />
      <SearchNetwork setSearchOpen={setSearchOpen} searchopen={searchopen} />
    </>
  );
};

export default Table;
