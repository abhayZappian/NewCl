import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";
import React, { useState, useEffect } from "react";

const Table = () => {
  const [data, setData] = useState([]);
  const [creativeWordsDetails, setCreativeWordsDetails] = useState({
    restrictedWord: [],
    spamWord: [],
    warningWord: [],
  });

  useEffect(() => {
    getNetworkList();
  }, []);

  const getNetworkList = async () => {
    const { data } = await axiosInstance.get(apiEndPoints.getNetworkList);
    setData(data?.data);
  };

  const creativeChecker = async (values) => {
    try {
      const data = {
        networkId: values,
      };
      const res = await axiosInstance.post(apiEndPoints.textChecker, data);
      if (res?.data?.data == null) {
        enqueueSnackbar(`No Data Found`, {
          variant: "error",
        });
      } else {
        setCreativeWordsDetails({
          restrictedWord: res?.data?.data?.restrictedWord,
          spamWord: res?.data?.data?.spamWord,
          warningWord: res?.data?.data?.warningWord,
        });
      }
      console.log(res, "res");
    } catch (error) {
      throw error;
    }
  };

  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: (values) => {
      console.log(values.text);
    },
  });

  const renderColoredText = () => {
    const inputText = formik.values.text.trim();
    let coloredText = [];

    // Function to check and apply color for a word or phrase
    const checkAndColorText = (text) => {
      const trimmedText = text.trim();
      const isRed = creativeWordsDetails?.restrictedWord?.includes(trimmedText);
      const isBlue = creativeWordsDetails?.spamWord?.includes(trimmedText);
      const isOrange = creativeWordsDetails?.warningWord?.includes(trimmedText);
      let backgroundColor = "transparent";

      if (isRed) backgroundColor = "red";
      if (isBlue) backgroundColor = "blue";
      if (isOrange) backgroundColor = "orange ";
      if (isBlue && isOrange) backgroundColor = "purple";

      return (
        <Typography
          key={text}
          variant="body1"
          sx={{
            color:
              backgroundColor === "blue" ||
              backgroundColor === "purple" ||
              backgroundColor === "red"
                ? "white"
                : "default",
            backgroundColor,
            display: "inline-block",
            marginRight: "4px",
          }}
        >
          {text}&nbsp;
        </Typography>
      );
    };

    // Split the text into individual words
    const words = inputText.split(/\s+/);

    // Iterate through each word
    for (let i = 0; i < words.length; i++) {
      let found = false;
      // Check for multi-word phrases
      for (let j = 10; j > 1; j--) {
        if (i + j <= words.length) {
          const phrase = words.slice(i, i + j).join(" ");
          if (
            creativeWordsDetails?.restrictedWord?.includes(phrase) ||
            creativeWordsDetails?.spamWord?.includes(phrase) ||
            creativeWordsDetails?.warningWord?.includes(phrase)
          ) {
            coloredText.push(checkAndColorText(phrase));
            i += j - 1;
            found = true;
            break;
          }
        }
      }
      // If no phrase is found, check the single word
      if (!found) {
        coloredText.push(checkAndColorText(words[i]));
      }
    }

    return coloredText;
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ width: "100%", height: "20%" }}>
          <Grid
            container
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              p: "10px",
            }}
          >
            <Grid item sx={{ width: "50%" }}>
              <Autocomplete
                disablePortal
                size="small"
                options={data}
                getOptionLabel={(option) => option.label}
                sx={{ width: "100%" }}
                onChange={(e, value) => {
                  creativeChecker(value?.value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Network Name" />
                )}
              />
            </Grid>
            <Grid item sx={{ ml: 4 }}>
              <Typography variant="h4">Important Notes</Typography>
              <Typography
                sx={{
                  display: "flex",
                  mt: 1,
                  fontWeight: 10,
                }}
                variant="h5"
              >
                ❖ Warning words are highlighted by{" "}
                <Typography
                  sx={{
                    color: "orange ",
                    fontWeight: "bold",
                    ml: 1,
                    mb: 1,
                    fontSize: "14px",
                  }}
                >
                  " Orange "
                </Typography>
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 10, display: "flex", mb: 1 }}
              >
                ❖ Restricted words are highlighted by{" "}
                <Typography
                  sx={{
                    ml: 1,
                    color: "red",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  " Red "
                </Typography>
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 10, display: "flex", mb: 1 }}
              >
                ❖ Spam words are highlighted by{" "}
                <Typography
                  sx={{
                    ml: 1,
                    color: "Blue",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  " Blue "
                </Typography>
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 10, display: "flex" }}>
                ❖ Spam and Warning words are highlighted by{" "}
                <Typography
                  sx={{
                    ml: 1,
                    color: "gray",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  " Gray "
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container sx={{ p: "10px" }}>
            <Grid item sx={{ width: "50%" }}>
              <Typography variant="h2"> Creative HTML Text </Typography>
              <div>
                <TextField
                  id="text"
                  name="text"
                  value={formik.values.text}
                  onChange={formik.handleChange}
                  multiline
                  rows={20}
                  sx={{
                    whiteSpace: "pre-line",
                    width: "100%",
                    marginTop: "10px",
                  }}
                />
              </div>
            </Grid>
            <Grid item sx={{ width: "50%" }}>
              <Typography variant="h2" sx={{ ml: 3, mt: 0.5 }}>
                Creative Preview
                <div>{renderColoredText()}</div>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};

export default Table;
