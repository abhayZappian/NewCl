import { Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import "./Sidebar.css";
import { Box } from "@mui/system";
import Icon from "@mdi/react";
import { baseURL } from "config/envConfig";
import {
  mdiEmailOutline,
  mdiEmailFastOutline,
  mdiClockStart,
  mdiStopCircleOutline,
  mdiLocationEnter,
  mdiCalendarClock,
  mdiWebhook,
  mdiSegment,
  mdiPlus,
  mdiViewListOutline,
  mdiCheckOutline,
  mdiAccountCircleOutline,
  mdiShapeOutline,
  mdiTimerSandComplete,
  mdiCalendarFilterOutline,
  mdiClipboardTextClock,
  mdiFormatPageSplit,
} from "@mdi/js";
import axiosInstance from "helpers/apiService";
import apiEndPoints from "helpers/APIEndPoints";
import { useDispatch, useSelector } from "react-redux";
import { setItemData } from "store/action/common";
import { selectItemData } from "store/selectors/common";

const onDragStart = (event, nodeType) => {
  // debugger;
  event.dataTransfer.setData("application/reactflow", nodeType); // Store the node type in a custom data attribute
  event.dataTransfer.effectAllowed = "move";
};
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Sidebar = () => {
  const [expanded, setExpanded] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const initialItemData = useSelector(selectItemData) || [];

  const handleChange = (panel) => (event, newExpanded) => {
    if (newExpanded) {
      setExpanded((prevExpanded) => [...prevExpanded, panel]);
    } else {
      setExpanded((prevExpanded) =>
        prevExpanded.filter((item) => item !== panel)
      );
    }
  };

  const [data, setData] = useState(initialItemData);

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get(apiEndPoints.itemsData)
      .then((response) => {
        setData(response.data);
        dispatch(setItemData(response.data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    if (initialItemData.length === 0) {
      fetchData();
    }
  }, []);
  useEffect(() => {
    if (data.length > 0) {
      setExpanded(data.map((item, index) => `panel${index}`));
    }
  }, [data]);

  return (
    <>
      <div className="main">
        <div className="description">
          <h2 style={{ fontWeight: 500, fontSize: "16px", color: "#ffffff" }}>
            Control Steps
          </h2>
        </div>

        {loading ? (
          <Box sx={{ width: 300, height: 500 }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        ) : (
          <div>
            {data.map((item, index) => {
              return (
                <>
                  <Accordion
                    expandIcon={<ExpandMoreIcon />}
                    onChange={handleChange(`panel${index}`)}
                    key={index}
                    expanded={expanded.includes(`panel${index}`)}
                  >
                    <AccordionSummary
                      className="sidebar_accordian_summary"
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                      sx={{
                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography key={index}>{item.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails className="sidebar_details">
                      {item?.items.map((item2, index2) => {
                        return (
                          <>
                            <div key={index2}>
                              <Box
                                className="details_icon_box1"
                                onDragStart={(event) =>
                                  onDragStart(event, item2.type)
                                }
                                draggable
                                key={item2.type}
                              >
                                <Box className="details_icon_box2">
                                  <Box className="details_icon_box3">
                                    {item2.type === "begin_journey" ? (
                                      <Icon path={mdiClockStart} size={1} />
                                    ) : item2.type === "event_occurs" ? (
                                      <Icon path={mdiCalendarClock} size={1} />
                                    ) : item2.type === "mail_template" ? (
                                      <Icon
                                        path={mdiEmailFastOutline}
                                        size={1}
                                      />
                                    ) : item2.type === "call_api_webhook" ? (
                                      <Icon path={mdiWebhook} size={1} />
                                    ) : item2.type === "add_to_list" ? (
                                      <Icon path={mdiSegment} size={1} />
                                    ) : item2.type === "is_in" ? (
                                      <Icon
                                        path={mdiViewListOutline}
                                        size={1}
                                      />
                                    ) : item2.type === "has_done" ? (
                                      <Icon path={mdiCheckOutline} size={1} />
                                    ) : item2.type === "if_this_happens" ? (
                                      <Icon path={mdiShapeOutline} size={1} />
                                    ) : item2.type === "user_attributes" ? (
                                      <Icon
                                        path={mdiAccountCircleOutline}
                                        size={1}
                                      />
                                    ) : item2.type === "wait_for" ? (
                                      <Icon path={mdiCalendarClock} size={1} />
                                    ) : item2.type === "wait_for_time_slot" ? (
                                      <Icon
                                        path={mdiTimerSandComplete}
                                        size={1}
                                      />
                                    ) : item2.type === "wait_for_event" ? (
                                      <Icon
                                        path={mdiCalendarFilterOutline}
                                        size={1}
                                      />
                                    ) : item2.type === "wait_for_date" ? (
                                      <Icon
                                        path={mdiClipboardTextClock}
                                        size={1}
                                      />
                                    ) : item2.type === "split" ? (
                                      <Icon
                                        path={mdiFormatPageSplit}
                                        size={1}
                                      />
                                    ) : item2.type === "end_journey" ? (
                                      <Icon
                                        path={mdiStopCircleOutline}
                                        size={1}
                                      />
                                    ) : item2.type ===
                                      "contact_enters_journey" ? (
                                      <Icon path={mdiLocationEnter} size={1} />
                                    ) : item2.type === "send_email" ? (
                                      <Icon path={mdiEmailOutline} size={1} />
                                    ) : item2.type === "add_data_to_field" ? (
                                      <Icon path={mdiPlus} size={1} />
                                    ) : null}
                                  </Box>
                                </Box>
                                <Box className="details_text_box">
                                  <Typography className="details_textbox_text">
                                    {item2.name}
                                  </Typography>
                                </Box>
                              </Box>
                            </div>
                          </>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
