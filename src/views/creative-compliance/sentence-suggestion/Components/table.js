import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { useState } from "react";
import CircularLoader from "ui-component/CircularLoader";

const Table = () => {
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sentenceSuggestion = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post(apiEndPoints.getSuggetionList, data);
      //console.log(res);
      const cleanSuggestions = res?.data?.data?.replace(/"/g, "");
      setSuggestion(cleanSuggestions);
      //console.log(res.data.data, "Anupam");
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      //searchData: "",
      prompt: "",
    },
    onSubmit: (values) => {
      const data = {
        //searchData: values?.searchData,
        prompt: values?.prompt,
      };
      sentenceSuggestion(data);
      //console.log(data);
    },
  });
  const resetFrom = () => {
    formik.resetForm();
    setSuggestion("");
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 4, mt: 2 }}>
            <Typography variant="h2" component="h2">
              Subject Line Suggestions
            </Typography>
          </Box>
          <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
            <Box sx={{ width: "50%" }}>
              <Typography sx={{ mb: 1 }} variant="h4" component="h4">
                Search Alternate Subject Lines
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                id="prompt"
                name="prompt"
                variant="outlined"
                value={formik.values.prompt}
                onChange={formik.handleChange}
                multiline
                rows={25}
              />
            </Box>

            <Box sx={{ width: "50%" }}>
              <Typography sx={{ mb: 1 }} variant="h4" component="h4">
                Preview Alternate Subject Lines
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                id="suggestion"
                name="suggestion"
                value={isLoading ? "" : suggestion}
                variant="outlined"
                multiline
                rows={25}
                disabled={!suggestion}
              />
              {isLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "53%",
                    left: "75%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <CircularLoader />
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              sx={{ width: "13%" }}
              variant="contained"
              disabled={!formik.values.prompt}
            >
              Search
            </Button>
            <Button
              onClick={resetFrom}
              sx={{ width: "13%" }}
              variant="outlined"
            >
              Clear
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default Table;
