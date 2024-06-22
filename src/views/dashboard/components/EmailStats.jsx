import React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import "./lead.css";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import axiosInstance from "helpers/apiService";
import { baseURL } from "config/envConfig";
import { useParams } from "react-router";
import { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import apiEndPoints from "helpers/APIEndPoints";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { display } from "@mui/system";
import cursor from "../../../assets/images/svgicons/cursor.svg";
import Vector from "../../../assets/images/svgicons/Vector.svg";
import debug from "../../../assets/images/svgicons/debug.svg";
import email from "../../../assets/images/svgicons/email.svg";

import eye from "../../../assets/images/svgicons/eye.svg";
import messagealert from "../../../assets/images/svgicons/messagealert.svg";
import thumbdown from "../../../assets/images/svgicons/thumbdown.svg";
import info from "../../../assets/images/svgicons/info.svg";
const EmailStats = () => {
  const [data, setData] = useState([]);

  const [chart, setChart] = useState({
    openTrend: null,
    openTrendDate: null,
    clickTrend: null,
    clickTrendDate: null,
    sentTrend: null,
    sentTrendDate: null,
    unsubTrend: null,
    unsubTrendDate: null,
  });

  const openRate = ((data?.countOpened / data?.countSent) * 100).toFixed(2);
  const CTR = ((data?.countClicked / data?.countSent) * 100).toFixed(2);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axiosInstance.post(apiEndPoints.getAllEmailStats);
    setChart((prevState) => ({
      ...prevState,
      openTrend: data.data.openTrend.map((e) => e.countOpen),
      openTrendDate: data.data.openTrend.map((e) => formatDate(e.date)),
      clickTrend: data.data.clickTrend.map((e) => e.countClicked),
      clickTrendDate: data.data.clickTrend.map((e) => formatDate(e.date)),
      sentTrend: data.data.sentTrend.map((e) => e.countSent),
      sentTrendDate: data.data.sentTrend.map((e) => formatDate(e.date)),
    }));
    setData(data.data);
  };

  const formatDate = (ustDate) => {
    const utcTime = new Date(ustDate);
    const FormattedDate =
      utcTime.getDate().toString().padStart(2, "0") +
      "-" +
      (utcTime.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      utcTime.getFullYear().toString();

    return FormattedDate;
  };

  const optionSentTrend = {
    title: {
      text: "",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["sentTrend"],
    },
    xAxis: {
      type: "category",
      data: chart.sentTrendDate,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chart?.sentTrend,
        type: "bar",
      },
    ],
  };

  const optionClickTrend = {
    title: {
      text: "",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: chart.clickTrendDate,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chart?.clickTrend,
        type: "bar",
      },
    ],
  };
  const optionOpenTrend = {
    title: {
      text: " ",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: chart.openTrendDate,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chart?.openTrend,
        type: "bar",
      },
    ],
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          bgcolor: "#EAEAEE",
        }}
      >
        <Box sx={{ display: "flex", gap: "7px", alignItems: "center" }}>
          <Typography variant="h2" sx={{ marginLeft: "26px" }}>
            Dashboard
          </Typography>
          <Box sx={{ margin: "0" }}>
            <img
              src={info}
              alt="info"
              style={{ width: "20px", marginTop: "5px" }}
            />
          </Box>
        </Box>
        <Box>
          <Grid container justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Button
                variant="outlined"
                sx={{
                  height: "35px",
                  width: "100px",
                  backgroundColor: "white",
                  marginRight: "36px",
                }}
              >
                <Typography variant="h6">Data Filters</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box>
        <Box p={2} mt={1}>
          <Grid
            container
            spacing={2}
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  {data?.countSent}
                </Typography>
                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  Count Sent
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#E1E8FF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={Vector} alt="Vector" style={{ width: "20px" }} />
              </Box>
            </Card>

            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  {data?.countOpened}
                </Typography>
                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  count Opened
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#FFF8EA",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={email} alt="emailopen" style={{ width: "25px" }} />
              </Box>
            </Card>

            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  {data?.countClicked}
                </Typography>
                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  Count Clicked
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#F3FFF3",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={cursor} alt="cursor" style={{ width: "25px" }} />
              </Box>
            </Card>

            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  {data?.countUnsub}
                </Typography>
                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  Count Unsub
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#FFF3F3",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={thumbdown}
                  alt="thumbdown"
                  style={{ width: "25px" }}
                />
              </Box>
            </Card>

            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  {openRate}%
                </Typography>

                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  Open Rate
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#FFF8EA",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={email} alt="email" style={{ width: "25px" }} />
              </Box>
            </Card>
            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  {CTR}%
                </Typography>

                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  CTR
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#F3FFF3",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={cursor} alt="cursor" style={{ width: "25px" }} />
              </Box>
            </Card>
            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  0
                </Typography>

                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  Complaints
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#FFF9F8",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={messagealert}
                  alt="messagalert"
                  style={{ width: "25px" }}
                />
              </Box>
            </Card>
            <Card item className="dashboard-grid">
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 10 }} variant="h2">
                  {data?.countBounce}
                </Typography>

                <Typography
                  sx={{ fontWeight: 10, color: "#909090", mt: "2px" }}
                  variant="h4"
                >
                  Count Bounce
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50px",
                  bgcolor: "#E1E8FF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={eye} alt="eye" style={{ width: "25px" }} />
              </Box>
            </Card>
          </Grid>
        </Box>

        <Box mb={1} p={2}>
          <Grid
            container
            spacing={2}
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Card item className="dashboard-card">
              <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography variant="h4" align="left" gutterBottom>
                  Sent Trend 7 days
                </Typography>
                <hr />
                {optionSentTrend?.series[0]?.data ? (
                  <ReactECharts
                    option={optionSentTrend}
                    style={{ height: "400px", width: "100%" }}
                  />
                ) : (
                  <div style={{ height: "400px", position: "relative" }}>
                    <Typography
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        padding: "10px",
                        border: "2px solid #444",
                        backgroundColor: "lightgoldenrodyellow",
                      }}
                      variant="h4"
                      align="center"
                      gutterBottom
                    >
                      No Data Found
                    </Typography>
                  </div>
                )}
              </Container>
            </Card>
            <Card item className="dashboard-card">
              <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography variant="h4" align="left" gutterBottom>
                  Click Trend 7 days
                </Typography>
                <hr />
                {optionClickTrend.series[0].data ? (
                  <ReactECharts
                    option={optionClickTrend}
                    style={{ height: "400px", width: "100%" }}
                  />
                ) : (
                  <div style={{ height: "400px", position: "relative" }}>
                    <Typography
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        padding: "10px",
                        border: "2px solid #444",
                        backgroundColor: "lightgoldenrodyellow",
                      }}
                      variant="h4"
                      align="center"
                      gutterBottom
                    >
                      No Data Found
                    </Typography>
                  </div>
                )}
              </Container>
            </Card>
            <Card item className="dashboard-card">
              <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Typography variant="h4" align="left" gutterBottom>
                  Open Trend 7 days
                </Typography>
                <hr />
                {optionOpenTrend?.series[0]?.data ? (
                  <>
                    <ReactECharts
                      option={optionOpenTrend}
                      style={{ height: "400px", width: "100%" }}
                    />
                  </>
                ) : (
                  <div style={{ height: "400px", position: "relative" }}>
                    <Typography
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        padding: "10px",
                        border: "2px solid #444",
                        backgroundColor: "lightgoldenrodyellow",
                      }}
                      variant="h4"
                      align="center"
                      gutterBottom
                    >
                      No Data Found
                    </Typography>
                  </div>
                )}
              </Container>
            </Card>
            {/* <Card item className="dashboard-card">
                            <Container component="main" maxWidth="lg">
                                <CssBaseline />
                                <Typography variant="h4" align="left" gutterBottom>
                                    Open Trend 7 days
                                </Typography>
                                <hr />
                                <ReactECharts option={optionOpenTrend} style={{ height: '400px', width: '100%' }} />
                            </Container>
                        </Card> */}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailStats;
