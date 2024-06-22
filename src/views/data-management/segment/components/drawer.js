import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ErrorIcon from "@mui/icons-material/Error";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import validationSchema from "../schema";
import dayjs from "dayjs";
import {
  addSegnmentData,
  getSegmentCategories,
  getSegmentFields,
  updateSegnmentData,
} from "services/dataManagement/segment";
import {
  getAbsolutesBehaviour,
  getBehaviour,
  getListData,
  getOfferList,
  getOperators,
  getRelativesBehaviour,
  getSlot,
  getTimes,
} from "services/common";
import {
  setAbsolutes,
  setBehaviour,
  setList,
  setOffers,
  setOperator,
  setRelatives,
  setSegmentCategory,
  setSegmentFields,
  setSlot,
} from "store/action/common";
import {
  selectAbsolutes,
  selectBehaviour,
  selectList,
  selectOffers,
  selectOperator,
  selectRelatives,
  selectSegmentCategory,
  selectSegmentFields,
  selectSlot,
} from "store/selectors/common";
import { getESPdetails } from "services/presets/pool";
import { flexbox } from "@mui/system";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
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

const CreateSegment = ({
  defaultValues,
  isDrawerOpen,
  setIsDrawerOpen,
  getDataRender,
  segnmentCategory,
}) => {
  console.log(segnmentCategory, "asdas");
  const [expanded, setExpanded] = useState();
  // const initialListData = useSelector(selectList) || [];
  const initialSegmentCategory = useSelector(selectSegmentCategory) || [];
  const initialAbsolute = useSelector(selectAbsolutes) || [];
  const initialSlot = useSelector(selectSlot) || [];
  const initialBehaviours = useSelector(selectBehaviour) || [];
  const initialOperator = useSelector(selectOperator) || [];
  const initialRelativesBehaviours = useSelector(selectRelatives) || [];
  // const initialOfferData = useSelector(selectOffers) || [];
  const initialSegmentFields = useSelector(selectSegmentFields) || [];

  const dispatch = useDispatch();
  let defaultValueslength = defaultValues && Object.keys(defaultValues).length;

  const [listData, setListData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [espOption, setEspOption] = useState([]);
  const [segmentCategory, setSegmentCategorys] = useState(
    initialSegmentCategory
  );
  const [segmentListFields, setSegmentListFields] =
    useState(initialSegmentFields);
  const [selectKeyOption, setSelectKeyOption] = useState(initialOperator);
  const [behaviours, setBehaviours] = useState(initialBehaviours);
  const [absolutesBehaviours, setAbsolutesBehaviours] =
    useState(initialAbsolute);
  const [relativesBehaviours, setRelativesBehaviours] = useState(
    initialRelativesBehaviours
  );
  const [slotOption, setSlotOption] = useState(initialSlot);
  const [actionType, setactionType] = useState("");
  const [countValue, setCountValue] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [timesData, setTimesData] = useState([]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const [myArray, setMyArray] = useState([]);
  const parsedDayTime = dayjs(`2022-04-17T${""}`);
  const handleValueChange = (
    label,
    type,
    condition,
    field_name,
    abs,
    esp_list
  ) => {
    if (type === 1) {
      setMyArray([...myArray, label]);
      formik.setFieldValue("main", [
        ...formik.values.main,
        {
          type: type,
          name: label,
          field_name: field_name,
          operator: "",
          operand: "",
          condition: condition,
        },
      ]);
    }
    if (type === 2) {
      setMyArray([...myArray, label]);
      formik.setFieldValue(
        "main",
        [
          ...formik.values.main,
          {
            condition: condition,
            field_name: field_name,
            from: "",
            // from_date: "",
            from_date: parsedDayTime.isValid() ? parsedDayTime.toDate() : null,

            name: label,
            operator: "",
            slot: "",
            time_range: "",
            to: "",
            // to_date: "",
            to_date: parsedDayTime.isValid() ? parsedDayTime.toDate() : null,

            to_slot: "",
            type: type,
            esp_list: "",
            repeat_from: "",
            repeat_operator: "",
            number_of_time: "",
          },
        ],
        false
      );
    }
    if (type === 3) {
      setMyArray([...myArray, label]);
      formik.setFieldValue("main", [
        ...formik.values.main,
        {
          abs: abs,
          abs_date_value: "",
          date_relative_type: "",
          date_relative_value: "",
          field_name: field_name,
          name: label,
          operatorSystemField: "",
          type: type,
          condition: condition,
        },
      ]);
    }
  };

  const addSegnment = async (values) => {
    const data = await addSegnmentData(
      values,
      closeDrawer,
      actionType,
      getDataRender,
      setCountValue,
      setDisableButton
    );
    if (data && actionType === "add") {
      formik.resetForm();
    }
    // setDisableButton(false);
  };
  const updateSegnment = async (values) => {
    await updateSegnmentData(
      values,
      closeDrawer,
      getDataRender,
      defaultValueslength,
      defaultValues?.segmentid
    );
    setDisableButton(false);
  };
  const formik = useFormik({
    initialValues: {
      segment_type: "List",
      segment_name: "",
      description: "",
      segmentCategory: {
        label: segnmentCategory,
        value: segnmentCategory,
      },
      main: [],
      list_id: "",
      offer_id: "",
      vertical_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form data submitted:", values);
      // if (values?.main && values?.main?.length > 0) {
      //   delete values.main[values.main.length - 1].condition;
      // }
      console.log("value after remove", values);
      if (defaultValueslength === 0 || actionType === "select") {
        setDisableButton(true);
        addSegnment(values);
      } else {
        setDisableButton(true);
        updateSegnment(values);
      }
    },
  });
  const getListsData = async () => {
    const data = await getListData();
    if (data) {
      setListData(data);
      // dispatch(setList(data));
    }
  };
  const getSegmentCategory = async () => {
    const data = await getSegmentCategories();
    if (data) {
      setSegmentCategorys(data);
      dispatch(setSegmentCategory(data));
    }
  };
  const getSegmentField = async () => {
    const data = await getSegmentFields();
    if (data) {
      dispatch(setSegmentFields(data?.segmentFields));
      setSegmentListFields(data?.segmentFields);
    }
  };
  const getOfferLists = async () => {
    const data = await getOfferList();
    if (data) {
      setOfferData(data);
      // dispatch(setOffers(data));
    }
  };
  const getOptionKey = async () => {
    const data = await getOperators();
    if (data) {
      setSelectKeyOption(data);
      dispatch(setOperator(data));
    }
  };
  const getBehaviours = async () => {
    const data = await getBehaviour();
    if (data) {
      setBehaviours(data);
      dispatch(setBehaviour(data));
    }
  };
  const getAbsolutesBehaviours = async () => {
    const data = await getAbsolutesBehaviour();
    if (data) {
      setAbsolutesBehaviours(data);
      dispatch(setAbsolutes(data));
    }
  };
  const getRelativesBehaviours = async () => {
    const data = await getRelativesBehaviour();
    if (data) {
      setRelativesBehaviours(data);
      dispatch(setRelatives(data));
    }
  };
  const getSlots = async () => {
    const data = await getSlot();
    if (data) {
      setSlotOption(data);
      dispatch(setSlot(data));
    }
  };
  const getESPList = async () => {
    const { data } = await getESPdetails();
    console.log(data, "dataaaaaa");
    if (data) {
      setEspOption(data);
    }
  };
  const getNoOfTimes = async () => {
    const data = await getTimes();
    if (data) {
      setTimesData(data);
      // dispatch(setList(data));
    }
  };
  useEffect(() => {
    // if (initialListData?.length === 0) {
    getListsData();
    // }
    if (initialSegmentCategory?.length === 0) {
      getSegmentCategory();
    }
    if (initialSegmentFields?.length === 0) {
      getSegmentField();
    }
    // if (initialOfferData.length === 0) {
    getOfferLists();
    // }
    if (initialOperator?.length === 0) {
      getOptionKey();
    }
    if (initialBehaviours?.length === 0) {
      getBehaviours();
    }
    if (initialAbsolute?.length === 0) {
      getAbsolutesBehaviours();
    }
    if (initialRelativesBehaviours.length === 0) {
      getRelativesBehaviours();
    }
    if (initialSlot?.length === 0) {
      getSlots();
    }
    getNoOfTimes();
    getESPList();
  }, []);

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      setFieldValues(defaultValues);
      const segmentDetails = JSON.parse(defaultValues?.segment_details);
      console.log(segmentDetails?.main, "segmentDetailssegmentDetails");
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);
  const setFieldValues = (values) => {
    const segmentDetails = JSON.parse(values?.segment_details);
    console.log(segmentDetails, "segmentCategory");

    const listData = {
      listid: values.listid,
      list_name: values.list_name,
    };
    const segnmentCategory = {
      label: ` ${
        values.segmentCategory === "emailengagement"
          ? "Email Engagement"
          : "Email Flush"
      }`,
      value: values.segmentCategory,
    };
    formik.setFieldValue("segment_name", segmentDetails?.segment_name);
    formik.setFieldValue("description", segmentDetails?.description);
    formik.setFieldValue("segment_type", segmentDetails?.segment_type);
    formik.setFieldValue("list_id", listData);
    formik.setFieldValue("segmentCategory", segnmentCategory);
    if (segmentDetails?.main) {
      formik.setFieldValue("main", segmentDetails?.main);
    }
  };
  const closeDrawer = () => {
    formik.handleReset();
    setIsDrawerOpen(false);
    setCountValue(null);
  };
  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      PaperProps={{
        sx: { width: "85%" },
      }}
    >
      <Box sx={{ m: 1, margin: "24px" }} noValidate autoComplete="off">
        <Typography sx={{ fontWeight: "600", fontSize: "2rem" }}>
          {defaultValueslength === 0 ? "Create Segment" : "Update Segment"}
        </Typography>
        <Box sx={{ marginTop: "30px" }}>
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#FEFEFE",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px #EAEAEE",
                // padding: "2rem 1rem",
                // gap: "35px",
                height: "190px",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  // justifyContent: 'space-evenly',
                  alignItems: "center",
                }}
              >
                {/* <Box sx={{ width: '30%', height: '65px' }}>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            row
                                            name="segment_type"
                                            value={formik.values.segment_type}
                                            onChange={formik.handleChange}
                                        >
                                            <FormControlLabel
                                                value="List"
                                                control={<Radio />}
                                                label="List"
                                                onChange={() => {
                                                    formik.handleReset();
                                                }}
                                            />
                                            <FormControlLabel
                                                value="Offer"
                                                control={<Radio />}
                                                label="Offer"
                                                onChange={() => {
                                                    formik.handleReset();
                                                }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    {formik.touched.segment_type && formik.errors.segment_type && (
                                        <div style={{ color: '#F4473B', fontSize: '12px' }}>{formik.errors.segment_type}</div>
                                    )}
                                </Box> */}
                <Box
                  sx={{
                    height: "65px",
                    width: "20%",
                    marginTop: "13px",
                    marginLeft: "96px",
                  }}
                >
                  <Autocomplete
                    size="small"
                    name="segmentCategory"
                    disableClearable
                    required
                    disabled={defaultValueslength !== 0}
                    options={segmentCategory}
                    getOptionLabel={(option) => option.label}
                    value={
                      segmentCategory.find(
                        (option) =>
                          option?.value ===
                          formik?.values?.segmentCategory?.value
                      ) || null
                    }
                    onChange={(e, newValue) => {
                      const selectedSegment = newValue ? newValue : "";
                      formik.setFieldValue("segmentCategory", selectedSegment);
                    }}
                    renderInput={(params) => (
                      <TextField
                        placeholder="Segment Category"
                        sx={{
                          backgroundColor: "#E9EEFF",
                          // border: "2px solid green",
                        }}
                        {...params}
                      />
                    )}
                  />
                  {formik.touched.segmentCategory &&
                    formik.errors.segmentCategory && (
                      <div style={{ color: "#F4473B", fontSize: "12px" }}>
                        {formik.errors.segmentCategory}
                      </div>
                    )}
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Box
                  sx={{
                    width: "20%",
                    height: "65px",
                  }}
                >
                  {formik?.values?.segment_type === "List" && (
                    <FormGroup>
                      <FormLabel
                        sx={{
                          color: "#0F0F0F",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          // mb: 1,
                          // mt: 2,
                          paddingY: "8px",
                        }}
                        htmlFor="list"
                      >
                        List Name
                      </FormLabel>
                      {/* {console.log(listData)}
                      {console.log(formik.values)} */}
                      <Autocomplete
                        // sx={{ height: "41px" }}
                        size="small"
                        id="list_id"
                        name="list_id"
                        required
                        disableClearable
                        options={listData}
                        value={
                          listData?.find(
                            (option) =>
                              option?.list_name ===
                              formik?.values?.list_id?.list_name
                          ) || null
                        }
                        getOptionLabel={(option) =>
                          `${option?.list_name}  (${option?.records})`
                        }
                        onBlur={formik.handleBlur}
                        onChange={(e, newValue) => {
                          const selectedList = newValue ? newValue : "";
                          formik.setFieldValue("list_id", selectedList);
                        }}
                        renderInput={(params) => (
                          <TextField
                            placeholder="Select"
                            sx={{ backgroundColor: "#E9EEFF" }}
                            {...params}
                          />
                        )}
                      />
                      {formik.touched.list_id && formik.errors.list_id && (
                        <div style={{ color: "#F4473B", fontSize: "12px" }}>
                          {formik.errors.list_id}
                        </div>
                      )}
                    </FormGroup>
                  )}
                  {formik?.values?.segment_type === "Offer" && (
                    <FormGroup>
                      <FormLabel
                        sx={{
                          color: "#0F0F0F",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          mb: 1,
                          mt: 2,
                        }}
                        htmlFor="offer_id"
                      >
                        Offer List
                      </FormLabel>
                      <Autocomplete
                        size="small"
                        id="offer_id"
                        name="offer_id"
                        required
                        disableClearable
                        options={offerData}
                        value={
                          offerData.find(
                            (option) =>
                              option?.offer_name ===
                              formik?.values?.offer_id?.offer_name
                          ) || null
                        }
                        getOptionLabel={(option) =>
                          `${option.offer_id} (${option.offer_name})`
                        }
                        onBlur={formik.handleBlur}
                        onChange={(e, newValue) => {
                          const selectedList = newValue ? newValue : "";
                          formik.setFieldValue("offer_id", selectedList);
                        }}
                        renderInput={(params) => (
                          <TextField
                            placeholder="Select"
                            sx={{ backgroundColor: "#E9EEFF" }}
                            {...params}
                          />
                        )}
                      />
                      {formik.touched.offer_id && formik.errors.offer_id && (
                        <div style={{ color: "#F4473B", fontSize: "12px" }}>
                          {formik.errors.offer_id}
                        </div>
                      )}
                    </FormGroup>
                  )}
                </Box>

                <Box sx={{ height: "65px", width: "20%" }}>
                  <FormGroup>
                    <FormLabel
                      sx={{
                        color: "#0F0F0F",
                        padding: "0.5rem 0",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                      htmlFor="SegmentName"
                    >
                      Segment Name
                    </FormLabel>
                    <TextField
                      size="small"
                      variant="outlined"
                      fullWidth
                      id="segment_name"
                      name="segment_name"
                      placeholder="Eg: Segment Name"
                      value={formik.values.segment_name}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.segment_name &&
                      formik.errors.segment_name && (
                        <div style={{ color: "#F4473B", fontSize: "12px" }}>
                          {formik.errors.segment_name}
                        </div>
                      )}
                  </FormGroup>
                </Box>
                <Box sx={{ height: "65px", width: "30%" }}>
                  <FormGroup>
                    <FormLabel
                      sx={{
                        color: "#0F0F0F",
                        padding: "0.5rem 0",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                      htmlFor="list"
                    >
                      Description
                    </FormLabel>
                    <div style={{ height: "65px" }}>
                      <TextField
                        autoComplete="off"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        // id="list"
                        name="description"
                        placeholder="Eg: Segment Description"
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <div style={{ color: "#F4473B", fontSize: "12px" }}>
                            {formik.errors.description}
                          </div>
                        )}
                    </div>
                  </FormGroup>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px #EAEAEE",
                gap: "1vw",
                mt: 2,
              }}
            >
              <Box
                sx={{
                  width: "18%",
                  backgroundColor: "#FEFEFE",
                  padding: "2rem 1rem",
                }}
              >
                <Typography sx={{ mb: 2 }}>Select Key</Typography>
                <Box sx={{ boxShadow: "0px 0px 10px #EAEAEE" }}>
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange("panel1")}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor:
                          expanded === "panel1" ? "#ffdfc5" : "none",
                      }}
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                    >
                      <Typography>List Fields</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {segmentListFields?.listFields?.map((field, index) => (
                        <ListItem
                          key={index}
                          disablePadding
                          onClick={() =>
                            handleValueChange(
                              field?.name,
                              field?.type,
                              field?.condition,
                              field?.field_name
                            )
                          }
                        >
                          <ListItemButton>
                            <ListItemText primary={field?.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel2"}
                    onChange={handleChange("panel2")}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor:
                          expanded === "panel2" ? "#ffdfc5" : "none",
                      }}
                      aria-controls="panel2d-content"
                      id="panel2d-header"
                    >
                      <Typography>Behavioral</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {segmentListFields?.behaviouralFields?.map(
                        (field, index) => (
                          <ListItem
                            key={index}
                            disablePadding
                            onClick={() =>
                              handleValueChange(
                                field?.name,
                                field?.type,
                                field?.condition,
                                field?.field_name,
                                field?.esp_list
                              )
                            }
                          >
                            {console.log(field)}
                            <ListItemButton>
                              <ListItemText primary={field?.name} />
                            </ListItemButton>
                          </ListItem>
                        )
                      )}
                    </AccordionDetails>
                  </Accordion>
                  {formik.values.segment_type === "List" && (
                    <>
                      {" "}
                      <Accordion
                        expanded={expanded === "panel3"}
                        onChange={handleChange("panel3")}
                      >
                        <AccordionSummary
                          sx={{
                            backgroundColor:
                              expanded === "panel3" ? "#ffdfc5" : "none",
                          }}
                          aria-controls="panel3d-content"
                          id="panel3d-header"
                        >
                          <Typography>System Field</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {segmentListFields?.systemFields?.map(
                            (field, index) => (
                              <ListItem
                                key={index}
                                disablePadding
                                onClick={() =>
                                  handleValueChange(
                                    field?.name,
                                    field?.type,
                                    field?.condition,
                                    field?.field_name,
                                    field?.abs
                                  )
                                }
                              >
                                <ListItemButton>
                                  <ListItemText primary={field?.name} />
                                </ListItemButton>
                              </ListItem>
                            )
                          )}{" "}
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )}

                  {/* ) : (
                <Box></Box>
              )}  */}
                </Box>
              </Box>

              <Box
                sx={{
                  width: "82%",
                  backgroundColor: "#FEFEFE",
                  padding: "2rem 1rem",
                }}
              >
                {formik.values.main.map((item, index) => {
                  const mainKey = `main[${index}]`;
                  let formikError = {
                    operandErr: formik.errors.main?.[index]?.operand,
                    operandTouch: formik.touched.main?.[index]?.operand,
                    operatorErr: formik.errors?.main?.[index]?.operator,
                    operatorTouch: formik.touched?.main?.[index]?.operator,
                    timeRangeErr:
                      formik.errors.main?.[index]?.time_range?.value,
                    timeRangeTouch: formik.touched.main?.[index]?.time_range,
                    fromDateErr: formik.errors.main?.[index]?.from_date,
                    fromDateTouch: formik.touched.main?.[index]?.from_date,
                    toDateErr: formik.errors.main?.[index]?.to_date,
                    toDateTouch: formik.touched.main?.[index]?.to_date,
                    fromErr: formik.errors.main?.[index]?.from,
                    fromTouch: formik.touched.main?.[index]?.from,
                    slotErr: formik.errors.main?.[index]?.slot,
                    slotTouch: formik.touched.main?.[index]?.slot,
                    toErr: formik.errors.main?.[index]?.to,
                    toTouch: formik.touched.main?.[index]?.to,
                    toSlotErr: formik.errors.main?.[index]?.to_slot,
                    toSlotTouch: formik.touched.main?.[index]?.to_slot,
                    //
                    repeatOperatorErr:
                      formik.errors.main?.[index]?.repeat_operator,
                    repeatOperatorTouch:
                      formik.touched.main?.[index]?.repeat_operator,
                    repeatFromErr: formik.errors.main?.[index]?.repeat_from,
                    repeatFromTouch: formik.touched.main?.[index]?.repeat_from,

                    //
                    absDateValveErr:
                      formik.errors.main?.[index]?.abs_date_value,
                    absDateValveTouch:
                      formik.touched.main?.[index]?.abs_date_value,
                    operatorSystemFieldErr:
                      formik.errors.main?.[index]?.operatorSystemField,
                    operatorSystemFieldTouch:
                      formik.touched.main?.[index]?.operatorSystemField,
                    dateRelativValueErr:
                      formik.errors.main?.[index]?.date_relative_value,
                    dateRelativValueTouch:
                      formik.touched.main?.[index]?.date_relative_value,
                    dateRelativTypeErr:
                      formik.errors.main?.[index]?.date_relative_type,
                    dateRelativTypeTouch:
                      formik.touched.main?.[index]?.date_relative_type,
                  };
                  return (
                    <Box
                      key={index}
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: "5px",
                        boxShadow: "0px 0px 10px #EAEAEE",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#ff831f",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: "5px" }}>
                          <Box
                            sx={{
                              backgroundColor: "#E9EEFF",
                              borderRadius: "5px",
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              sx={{ color: "black" }}
                            >
                              <ErrorIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{
                              backgroundColor: "#c24a4a",
                              color: "#2f2f33",
                              textTransform: "capitalize",
                            }}
                            endIcon={<DeleteForeverIcon />}
                            onClick={() => {
                              formik.setFieldValue("main", [
                                ...formik.values.main.slice(0, index),
                                ...formik.values.main.slice(index + 1),
                              ]);
                            }}
                          >
                            remove
                          </Button>
                        </Box>
                      </Box>
                      {item?.type === 1 && (
                        <Box
                          sx={{
                            my: 1,
                            width: "60%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "20px",
                            paddingBottom: 5,
                          }}
                        >
                          <FormGroup sx={{ width: "295px" }}>
                            <FormLabel
                              sx={{
                                color: "#0F0F0F",
                                padding: "0.5rem 0",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                              }}
                              name="operator"
                            >
                              Match key
                            </FormLabel>
                            <Autocomplete
                              sx={{ height: 3 }}
                              disableClearable
                              onBlur={formik.handleBlur}
                              size="medium"
                              id={`main.${index}.operator`}
                              name={`main.${index}.operator`}
                              required
                              options={selectKeyOption}
                              getOptionLabel={(option) => option.label}
                              value={
                                selectKeyOption?.find(
                                  (option) =>
                                    option?.value === item.operator?.value
                                ) || null
                              }
                              onChange={(e, newValue) => {
                                const selectedoperator = newValue
                                  ? newValue
                                  : "";
                                formik.setFieldValue(
                                  `${mainKey}.operator`,
                                  selectedoperator,
                                  true
                                );
                                formik.setFieldValue(
                                  `${mainKey}.operand`,
                                  "",
                                  true
                                );
                                setTimeout(() => {
                                  formik.validateField(`${mainKey}.operator`);
                                  formik.validateField(`${mainKey}.operand`);
                                }, 0);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  placeholder="Match Key"
                                  sx={{
                                    backgroundColor: "#E9EEFF",
                                    // height: 3,
                                  }}
                                  size="medium"
                                  {...params}
                                  error={
                                    formikError.operatorTouch &&
                                    Boolean(formikError.operatorErr)
                                  }
                                  helperText={
                                    formikError.operandTouch &&
                                    formikError.operatorErr
                                  }
                                />
                              )}
                            />
                          </FormGroup>
                          <FormGroup sx={{ width: "295px" }}>
                            <FormLabel
                              sx={{
                                color: "#0F0F0F",
                                padding: "0.5rem 0",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                              }}
                              name="operand"
                            >
                              Match Value
                            </FormLabel>
                            <TextField
                              sx={{
                                height: 3,
                              }}
                              size="medium"
                              variant="outlined"
                              fullWidth
                              name={`main.${index}.operand`}
                              placeholder="Match with"
                              onChange={formik.handleChange}
                              value={formik?.values?.main[index]?.operand}
                              error={
                                formikError.operandTouch &&
                                Boolean(formikError.operandErr)
                              }
                              helperText={
                                formikError.operandTouch &&
                                formikError.operandErr
                              }
                            />
                          </FormGroup>
                        </Box>
                      )}
                      {item?.type === 2 && (
                        <Box
                          sx={{
                            my: 1,
                            width: "80%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            // alignItems: "center",
                            gap: "20px",
                            // border: "4px solid blue",
                          }}
                        >
                          <div style={{ width: "100%" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      `main[${index}].operator`,
                                      e.target.checked
                                    );
                                  }}
                                  name={formik.values.main[index].operator}
                                />
                              }
                              label={`Not ${item.name}`}
                            />
                          </div>
                          <div>
                            <FormLabel
                              sx={{
                                color: "#0F0F0F",
                                padding: "0.5rem 0",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                // border: "2px solid red",
                              }}
                            >
                              Time Range
                            </FormLabel>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                // alignItems: "center",
                                marginTop: "10px",
                                //   border: "2px solid red",
                              }}
                            >
                              <Autocomplete
                                sx={{ width: "25%" }}
                                size="medium"
                                options={behaviours}
                                getOptionLabel={(option) => option.label || ""}
                                name={`main.${index}.time_range`}
                                value={formik.values.main[index].time_range}
                                onChange={(event, value) => {
                                  formik.setFieldValue(
                                    `main.${index}.time_range`,
                                    value,
                                    true
                                  );
                                  formik.setFieldValue(
                                    `main.${index}.from_date`,
                                    "",
                                    true
                                  );
                                  formik.setFieldValue(
                                    `main.${index}.to_date`,
                                    "",
                                    true
                                  );
                                  formik.setFieldValue(
                                    `main.${index}.to_slot`,
                                    "",
                                    false
                                  );
                                  formik.setFieldValue(
                                    `main.${index}.to`,
                                    "",
                                    false
                                  );
                                  formik.setFieldValue(
                                    `main.${index}.from`,
                                    "",
                                    false
                                  );
                                  formik.setFieldValue(
                                    `main.${index}.slot`,
                                    "",
                                    true
                                  );
                                  formikError.fromTouch = false;
                                  formikError.fromErr = "";

                                  setTimeout(() => {
                                    formik.validateField(
                                      `${mainKey}.time_range`
                                    );
                                    formik.validateField(`${mainKey}.slot`);
                                    formik.validateField(`${mainKey}.from`);
                                    formik.validateField(`main.${index}.slot`);
                                    formikError.fromTouch = false;
                                    formikError.fromErr = "";
                                    formikError.slotErr = "";
                                    formikError.slotTouch = false;
                                  }, 0);
                                }}
                                disableClearable
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Select behaviour"
                                    error={Boolean(formikError.timeRangeErr)}
                                    helperText={formikError.timeRangeErr}
                                  />
                                )}
                              />
                              {formik?.values?.main[index]?.time_range
                                ?.value === "custom" && (
                                <div
                                  style={{
                                    // border: "2px solid green ",
                                    display: "flex",
                                    width: "735px",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        value={dayjs(
                                          formik.values.main[index].from_date
                                        )}
                                        label="From Date"
                                        size="medium"
                                        onChange={(newValue) => {
                                          const value = new Date(newValue.$d);
                                          const currentTime = new Date();
                                          value.setHours(
                                            currentTime.getHours()
                                          );
                                          value.setMinutes(
                                            currentTime.getMinutes()
                                          );
                                          value.setSeconds(
                                            currentTime.getSeconds()
                                          );
                                          formik.setFieldValue(
                                            `main[${index}].from_date`,
                                            value,
                                            true
                                          );
                                        }}
                                        slotProps={{
                                          textField: {
                                            helperText: Boolean(
                                              formikError.fromDateErr
                                            )
                                              ? formikError.fromDateErr
                                              : "",
                                          },
                                        }}
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>

                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        value={dayjs(
                                          formik.values.main[index].to_date
                                        )}
                                        label="To Date"
                                        // onChange={(newValue) =>
                                        //   formik.setFieldValue(
                                        //     `${mainKey}.to_date`,
                                        //     newValue.$d,
                                        //     true
                                        //   )
                                        // }
                                        onChange={(newValue) => {
                                          const value = new Date(newValue.$d);
                                          const currentTime = new Date();
                                          value.setHours(
                                            currentTime.getHours()
                                          );
                                          value.setMinutes(
                                            currentTime.getMinutes()
                                          );
                                          value.setSeconds(
                                            currentTime.getSeconds()
                                          );
                                          formik.setFieldValue(
                                            `${mainKey}.to_date`,
                                            value,
                                            true
                                          );
                                        }}
                                        slotProps={{
                                          textField: {
                                            helperText: Boolean(
                                              formikError.toDateTouch
                                            )
                                              ? formikError.toDateErr
                                              : "",
                                          },
                                        }}
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                </div>
                              )}
                              {formik?.values?.main[index]?.time_range
                                ?.value === "between" && (
                                <div
                                  style={{
                                    // border: "2px solid green ",
                                    display: "flex",
                                    width: "70%",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-evenly",
                                    }}
                                  >
                                    <div>
                                      <FormGroup
                                        sx={{
                                          width: "240px",
                                        }}
                                      >
                                        <FormLabel
                                          sx={{
                                            color: "#0F0F0F",
                                            padding: "0.5rem 0",
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                          }}
                                          name="from"
                                        >
                                          From
                                        </FormLabel>
                                        <TextField
                                          placeholder="Count of (Days/Months)"
                                          type="number"
                                          name={`main.${index}.from`}
                                          onChange={(e) => {
                                            formik.handleChange(e);
                                          }}
                                          sx={{
                                            backgroundColor: "#E9EEFF",
                                            // border: "2px solid green",
                                          }}
                                          value={
                                            formik?.values?.main[index]?.from
                                          }
                                          error={
                                            formikError.fromTouch &&
                                            Boolean(formikError.fromErr)
                                          }
                                          helperText={
                                            formikError.fromTouch &&
                                            formikError.fromErr
                                          }
                                        />
                                      </FormGroup>
                                    </div>
                                    <div>
                                      <FormGroup
                                        sx={{
                                          width: "240px",
                                        }}
                                      >
                                        <FormLabel
                                          sx={{
                                            color: "#0F0F0F",
                                            padding: "0.5rem 0",
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                          }}
                                          name={`main.${index}.slot`}
                                        >
                                          Slot
                                        </FormLabel>
                                        <Autocomplete
                                          sx={{
                                            width: "240px",
                                          }}
                                          size="medium"
                                          disableClearable
                                          options={slotOption}
                                          getOptionLabel={(option) =>
                                            option?.label || ""
                                          }
                                          isOptionEqualToValue={(
                                            option,
                                            value
                                          ) => option?.label === value?.label}
                                          onChange={(e, newvalue) => {
                                            formik.setFieldValue(
                                              `main.${[index]}.slot`,
                                              newvalue
                                            );
                                          }}
                                          name={`main.${index}.slot`}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                              placeholder="Select Slot"
                                              error={
                                                formikError.slotTouch &&
                                                Boolean(formikError.slotErr)
                                              }
                                              helperText={
                                                formikError.slotTouch &&
                                                formikError.slotErr
                                              }
                                            />
                                          )}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-evenly",
                                    }}
                                  >
                                    <div>
                                      <FormGroup
                                        sx={{
                                          width: "240px",
                                        }}
                                      >
                                        <FormLabel
                                          sx={{
                                            color: "#0F0F0F",
                                            padding: "0.5rem 0",
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                          }}
                                          name="to"
                                        >
                                          To
                                        </FormLabel>
                                        <TextField
                                          placeholder="Count of (Days/Months)"
                                          type="number"
                                          name={`main.${index}.to`}
                                          value={
                                            formik?.values?.main[index]?.to
                                          }
                                          onChange={formik.handleChange}
                                          error={
                                            formikError.toTouch &&
                                            Boolean(formikError.toErr)
                                          }
                                          helperText={
                                            formikError.toTouch &&
                                            formikError.toErr
                                          }
                                          sx={{
                                            backgroundColor: "#E9EEFF",
                                            // border: "2px solid green",
                                          }}
                                        />
                                      </FormGroup>
                                    </div>
                                    <div>
                                      <FormGroup
                                        sx={{
                                          width: "240px",
                                        }}
                                      >
                                        <FormLabel
                                          sx={{
                                            color: "#0F0F0F",
                                            padding: "0.5rem 0",
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                          }}
                                          name="to_slot"
                                        >
                                          To Slot
                                        </FormLabel>
                                        <Autocomplete
                                          sx={{
                                            width: "240px",
                                          }}
                                          size="medium"
                                          disableClearable
                                          options={slotOption}
                                          getOptionLabel={(option) =>
                                            option?.label || ""
                                          }
                                          value={
                                            slotOption?.find(
                                              (option) =>
                                                option?.value ===
                                                  formik?.values?.main[index]
                                                    ?.to_slot?.value || ""
                                            ) || ""
                                          }
                                          onChange={(e, newvalue) => {
                                            formik.setFieldValue(
                                              `main.${[index]}.to_slot`,
                                              newvalue
                                            );
                                          }}
                                          name={`main.${index}.to_slot`}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                              placeholder="Select Slot"
                                              error={
                                                formikError.toSlotTouch &&
                                                Boolean(formikError.toSlotErr)
                                              }
                                              helperText={
                                                // formikError.toSlotTouch &&
                                                formikError.toSlotErr
                                              }
                                            />
                                          )}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {[">=", "<", ">", "<="].includes(
                                formik?.values?.main[index]?.time_range.value
                              ) && (
                                <div
                                  style={{
                                    // border: "2px solid green ",
                                    display: "flex",
                                    width: "70%",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-evenly",
                                    }}
                                  >
                                    <div>
                                      <FormGroup
                                        sx={{
                                          width: "240px",
                                        }}
                                      >
                                        <FormLabel
                                          sx={{
                                            color: "#0F0F0F",
                                            padding: "0.5rem 0",
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                          }}
                                          name="from"
                                        >
                                          From
                                        </FormLabel>
                                        <TextField
                                          placeholder="Count of (Days/Months)"
                                          type="number"
                                          name={`main.${index}.from`}
                                          onChange={formik.handleChange}
                                          sx={{
                                            backgroundColor: "#E9EEFF",
                                            // border: "2px solid green",
                                          }}
                                          value={
                                            formik?.values?.main[index]?.from
                                          }
                                          error={
                                            formikError.fromTouch &&
                                            Boolean(formikError.fromErr)
                                          }
                                          helperText={
                                            formikError.fromTouch &&
                                            formikError.fromErr
                                          }
                                        />
                                      </FormGroup>
                                    </div>
                                    <div>
                                      <FormGroup
                                        sx={{
                                          width: "240px",
                                        }}
                                      >
                                        <FormLabel
                                          sx={{
                                            color: "#0F0F0F",
                                            padding: "0.5rem 0",
                                            fontSize: "0.9rem",
                                            fontWeight: "500",
                                          }}
                                          name={`main.${index}.slot`}
                                        >
                                          Slot
                                        </FormLabel>
                                        <Autocomplete
                                          sx={{
                                            width: "240px",
                                          }}
                                          size="medium"
                                          disableClearable
                                          options={slotOption}
                                          getOptionLabel={(option) =>
                                            option?.label || ""
                                          }
                                          value={
                                            slotOption.find(
                                              (option) =>
                                                option?.value ===
                                                formik?.values?.main[index]
                                                  ?.slot?.value
                                            ) || null
                                          }
                                          onChange={(e, newvalue) => {
                                            formik.setFieldValue(
                                              `main.${[index]}.slot`,
                                              newvalue
                                            );
                                          }}
                                          name={`main.${index}.slot`}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              variant="outlined"
                                              placeholder="Select Slot"
                                              error={
                                                formikError.slotTouch &&
                                                Boolean(formikError.slotErr)
                                              }
                                              helperText={
                                                formikError.slotTouch &&
                                                formikError.slotErr
                                              }
                                            />
                                          )}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <FormGroup
                              sx={{
                                display: `${
                                  item.name === "Created Date" ? "none" : ""
                                }`,
                              }}
                            >
                              <FormLabel
                                sx={{
                                  color: "#0F0F0F",
                                  fontSize: "0.9rem",
                                  fontWeight: "500",
                                  // mb: 1,
                                  // mt: 2,
                                  paddingY: "8px",
                                }}
                                htmlFor="esp_id"
                              >
                                ESP
                              </FormLabel>
                              {/* {console.log(listData)}
                      {console.log(formik.values)} */}
                              <Autocomplete
                                // sx={{ height: "41px" }}

                                id="esp_id"
                                name="esp_id"
                                sx={{ width: "25%" }}
                                size="medium"
                                required
                                options={espOption}
                                value={
                                  formik.values.main[index].esp_list || null
                                }
                                getOptionLabel={(option) =>
                                  `${option?.esp_name} `
                                }
                                onBlur={formik.handleBlur}
                                onChange={(e, newValue) => {
                                  const selectedList = newValue ? newValue : "";
                                  formik.setFieldValue(
                                    `main[${index}].esp_list`,
                                    selectedList
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    placeholder="Select ESP"
                                    sx={{
                                      backgroundColor: "#E9EEFF",
                                    }}
                                    {...params}
                                  />
                                )}
                              />
                            </FormGroup>

                            {/* <FormControlLabel */}
                            {/* control={ */}
                            <FormLabel
                              sx={{
                                color: "#0F0F0F",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                // mb: 1,
                                // mt: 2,
                                paddingY: "8px",
                                display: `${
                                  item.name === "Created Date" ? "none" : ""
                                }`,
                              }}
                              htmlFor={formik.values.main[index].number_of_time}
                            >
                              Number of times
                            </FormLabel>
                          <Checkbox
                              // sx={{
                              //   fontSize: 28,
                              // }}
                              sx={{
                                display: `${
                                  item.name === "Created Date" ? "none" : ""
                                }`,
                                fontSize: 28,
                              }}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `main[${index}].number_of_time`,
                                  e.target.checked
                                );
                                formik.setFieldValue(
                                  `main[${index}].repeat_operator`,
                                  ""
                                );
                                formik.setFieldValue(
                                  `main[${index}].repeat_from`,
                                  ""
                                );
                              }}
                              name={formik.values.main[index].number_of_time}
                            /> 
                            {/* } */}
                            {/* /> */}

                            {formik.values.main[index].number_of_time && (
                              <div
                                style={{
                                  // border: "2px solid green",
                                  display: "flex",
                                  gap: 40,
                                }}
                              >
                                <FormGroup
                                  sx={{
                                    width: "240px",
                                  }}
                                >
                                  <FormLabel
                                    sx={{
                                      color: "#0F0F0F",
                                      padding: "0.5rem 0",
                                      fontSize: "0.9rem",
                                      fontWeight: "500",
                                    }}
                                    name={`main.${index}.slot`}
                                  >
                                    Time Range
                                  </FormLabel>
                                  <Autocomplete
                                    sx={{
                                      width: "240px",
                                      height: "51px",
                                    }}
                                    size="medium"
                                    disableClearable
                                    options={timesData}
                                    getOptionLabel={(option) =>
                                      option?.label || ""
                                    }
                                    value={
                                      timesData.find(
                                        (option) =>
                                          option?.value ===
                                          formik?.values?.main[index]
                                            ?.repeat_operator?.value
                                      ) || null
                                    }
                                    onChange={(e, newvalue) => {
                                      formik.setFieldValue(
                                        `main.${[index]}.repeat_operator`,
                                        newvalue
                                      );
                                      formik.validateField(
                                        `main.${index}.repeat_operator`
                                      );
                                    }}
                                    name={`main.${index}.repeat_operator`}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Select Behaviour"
                                        error={
                                          formikError.repeatOperatorTouch &&
                                          Boolean(formikError.repeatOperatorErr)
                                        }
                                        helperText={
                                          formikError.repeatOperatorTouch &&
                                          formikError.repeatOperatorErr
                                        }
                                      />
                                    )}
                                  />
                                </FormGroup>
                                <FormGroup
                                  sx={{
                                    width: "240px",
                                  }}
                                >
                                  <FormLabel
                                    sx={{
                                      color: "#0F0F0F",
                                      padding: "0.5rem 0",
                                      fontSize: "0.9rem",
                                      fontWeight: "500",
                                    }}
                                    name={`main.${index}.slot`}
                                  >
                                    Times
                                  </FormLabel>
                                  <TextField
                                    type="number"
                                    name={`main.${index}.repeat_from`}
                                    placeholder="Enter Time"
                                    onChange={formik.handleChange}
                                    sx={{
                                      backgroundColor: "#E9EEFF",
                                      height: "51px",
                                    }}
                                    value={
                                      formik?.values?.main[index]?.repeat_from
                                    }
                                    error={
                                      formikError.repeatFromTouch &&
                                      Boolean(formikError.repeatFromErr)
                                    }
                                    helperText={
                                      formikError.repeatFromTouch &&
                                      formikError.repeatFromErr
                                    }
                                  />
                                </FormGroup>
                              </div>
                            )}
                          </div>
                        </Box>
                      )}
                      {item?.type === 3 && (
                        <Box
                          sx={{
                            my: 1,
                            width: "80%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "20px",
                            // border: "4px solid blue",
                          }}
                        >
                          <div style={{ width: "100%" }}>
                            <FormControl component="fieldset">
                              <RadioGroup
                                row
                                name={`main.${[index]}.abs`}
                                value={formik.values.main[index].abs}
                                // onChange={formik.handleChange}
                                onChange={(event) => {
                                  formik.handleChange(event);
                                  if (event.target.value == 1) {
                                    formik.setFieldValue(
                                      `main.${index}.operatorSystemField`,
                                      ""
                                    );
                                    formik.setFieldValue(
                                      `main.${index}.date_relative_value`,
                                      ""
                                    );
                                    formik.setFieldValue(
                                      `main.${index}.date_relative_type`,
                                      ""
                                    );
                                  }
                                  if (event.target.value == 2) {
                                    formik.setFieldValue(
                                      `main.${index}.operatorSystemField`,
                                      ""
                                    );
                                    formik.setFieldValue(
                                      `main.${index}.abs_date_value`,
                                      ""
                                    );
                                  }
                                  setTimeout(() => {
                                    formik.validateField(
                                      `main.${index}.operatorSystemField`
                                    );
                                  }, 0);
                                }}
                              >
                                <FormControlLabel
                                  value={1}
                                  control={<Radio />}
                                  label="Absolute"
                                />
                                <FormControlLabel
                                  value={2}
                                  control={<Radio />}
                                  label="Relative"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                          <div>
                            {formik.values.main[index].abs == 1 && (
                              <>
                                {" "}
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "10px",
                                    // border: "2px solid pink",
                                    justifyContent: "space-around",
                                  }}
                                >
                                  <div
                                    style={{
                                      // border: "2px solid green",
                                      width: "35%",
                                    }}
                                  >
                                    <FormLabel
                                      sx={{
                                        color: "#0F0F0F",
                                        padding: "0.5rem 0",
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                      }}
                                    >
                                      Behaviour
                                    </FormLabel>
                                    <Autocomplete
                                      sx={{
                                        height: "90px",
                                        marginTop: "8px",
                                      }}
                                      size="medium"
                                      options={absolutesBehaviours}
                                      name={`main.${index}.operatorSystemField`}
                                      value={
                                        formik.values.main[index]
                                          .operatorSystemField
                                      }
                                      onChange={(event, newvalue) => {
                                        formik.setFieldValue(
                                          `main.${index}.operatorSystemField`,
                                          newvalue
                                        );
                                        formik.setFieldValue(
                                          `main.${index}.abs_date_value`,
                                          ""
                                        );
                                        setTimeout(() => {
                                          formik.validateField(
                                            `main.${index}.operatorSystemField`
                                          );
                                          formik.validateField(
                                            `${mainKey}.abs_date_value`
                                          );
                                        }, 0);
                                      }}
                                      disableClearable
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          placeholder="Select behaviour"
                                          error={
                                            formikError.operatorSystemFieldTouch &&
                                            Boolean(
                                              formikError.operatorSystemFieldErr
                                            )
                                          }
                                          helperText={
                                            formikError.operatorSystemFieldTouch &&
                                            formikError.operatorSystemFieldErr
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                  <div>
                                    {" "}
                                    <FormLabel
                                      sx={{
                                        color: "#0F0F0F",
                                        padding: "0.5rem 0",
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                        // border: "2px solid red",
                                      }}
                                    >
                                      From date
                                    </FormLabel>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDayjs}
                                    >
                                      <DemoContainer
                                        components={["DatePicker"]}
                                        sx={{
                                          height: "90px",
                                        }}
                                      >
                                        <DatePicker
                                          // sx={{ height:"59px",border:"2px solid red" }}
                                          label="From Date"
                                          size="medium"
                                          value={dayjs(
                                            formik.values.main[index]
                                              .abs_date_value
                                          )}
                                          onChange={(newValue) => {
                                            const value = new Date(newValue.$d);
                                            const currentTime = new Date();
                                            value.setHours(
                                              currentTime.getHours()
                                            );
                                            value.setMinutes(
                                              currentTime.getMinutes()
                                            );
                                            value.setSeconds(
                                              currentTime.getSeconds()
                                            );
                                            formik.setFieldValue(
                                              `${mainKey}.abs_date_value`,
                                              value,
                                              true
                                            );
                                          }}
                                          slotProps={{
                                            textField: {
                                              helperText: Boolean(
                                                formikError.absDateValveTouch
                                              )
                                                ? formikError.absDateValveErr
                                                : "",
                                            },
                                          }}
                                        />
                                      </DemoContainer>
                                    </LocalizationProvider>
                                  </div>
                                </div>
                              </>
                            )}
                            {formik.values.main[index].abs == 2 && (
                              <>
                                {" "}
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "10px",
                                    // border: "2px solid pink",
                                    justifyContent: "space-around",
                                  }}
                                >
                                  <div
                                    style={{
                                      // border: "2px solid green",
                                      width: "35%",
                                    }}
                                  >
                                    <FormGroup sx={{ width: "240px" }}>
                                      {" "}
                                      <FormLabel
                                        sx={{
                                          color: "#0F0F0F",
                                          padding: "0.5rem 0",
                                          fontSize: "0.9rem",
                                          fontWeight: "500",
                                        }}
                                      >
                                        Behaviour
                                      </FormLabel>
                                    </FormGroup>

                                    <Autocomplete
                                      sx={{ height: "51px" }}
                                      size="medium"
                                      options={relativesBehaviours}
                                      name={`main.${index}.operatorSystemField`}
                                      value={
                                        formik.values.main[index]
                                          .operatorSystemField
                                      }
                                      onChange={(event, newvalue) => {
                                        formik.setFieldValue(
                                          `main.${index}.operatorSystemField`,
                                          newvalue
                                        );
                                        formik.setFieldValue(
                                          `main.${index}.abs_date_value`,
                                          ""
                                        );
                                        formik.setFieldValue(
                                          `main.${index}.date_relative_value`,
                                          ""
                                        );
                                        formik.setFieldValue(
                                          `main.${index}.date_relative_type`,
                                          "",
                                          true
                                        );
                                        setTimeout(() => {
                                          formik.validateField(
                                            `main.${index}.operatorSystemField`
                                          );
                                          formik.validateField(
                                            `main.${index}.date_relative_value`
                                          );
                                          formik.validateField(
                                            `main.${index}.date_relative_type`
                                          );
                                        }, 0);
                                      }}
                                      disableClearable
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          placeholder="Select behaviour"
                                          error={
                                            formikError.operatorSystemFieldTouch &&
                                            Boolean(
                                              formikError.operatorSystemFieldErr
                                            )
                                          }
                                          helperText={
                                            formikError.operatorSystemFieldTouch &&
                                            formikError.operatorSystemFieldErr
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                  <FormGroup sx={{ width: "240px" }}>
                                    <FormLabel
                                      sx={{
                                        color: "#0F0F0F",
                                        padding: "0.5rem 0",
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                      }}
                                      name={`main${[
                                        index,
                                      ]}.date_relative_value`}
                                    >
                                      Hours/Days Counts
                                    </FormLabel>
                                    <TextField
                                      placeholder="Count of (Hours/Days)"
                                      type="number"
                                      name={`main.${index}.date_relative_value`}
                                      onChange={formik.handleChange}
                                      sx={{
                                        backgroundColor: "#E9EEFF",
                                        height: "51px",
                                        // border: "2px solid green",
                                      }}
                                      value={
                                        formik?.values?.main[index]
                                          ?.date_relative_value
                                      }
                                      error={
                                        formikError.dateRelativValueTouch &&
                                        Boolean(formikError.dateRelativValueErr)
                                      }
                                      helperText={
                                        formikError.dateRelativValueTouch &&
                                        formikError.dateRelativValueErr
                                      }
                                    />
                                  </FormGroup>

                                  <FormGroup sx={{ width: "240px" }}>
                                    <FormLabel
                                      sx={{
                                        color: "#0F0F0F",
                                        padding: "0.5rem 0",
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                      }}
                                      name={`main.${index}.date_relative_type`}
                                    >
                                      Slot
                                    </FormLabel>
                                    <Autocomplete
                                      sx={{
                                        width: "240px",
                                        height: "51px",
                                      }}
                                      size="medium"
                                      options={slotOption}
                                      getOptionLabel={(option) => option?.label}
                                      // value={
                                      //   slotOption.find(
                                      //     (option) =>
                                      //       option?.value ===
                                      //       formik?.values?.main[index]
                                      //         ?.date_relative_type?.value
                                      //   )
                                      // }
                                      value={
                                        formik.values.main[index]
                                          .date_relative_type || null
                                      }
                                      onChange={(e, newvalue) => {
                                        formik.setFieldValue(
                                          `main.${[index]}.date_relative_type`,
                                          newvalue
                                        );
                                      }}
                                      name={`main.${index}.date_relative_type`}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          placeholder="Select Slot"
                                          error={
                                            formikError.dateRelativTypeTouch &&
                                            Boolean(
                                              formikError.dateRelativTypeErr
                                            )
                                          }
                                          helperText={
                                            formikError.dateRelativTypeTouch &&
                                            formikError.dateRelativTypeErr
                                          }
                                        />
                                      )}
                                    />
                                  </FormGroup>
                                </div>
                              </>
                            )}
                          </div>
                        </Box>
                      )}
                      {index < formik.values.main.length - 1 && (
                        <FormControl component="main">
                          <RadioGroup
                            row
                            value={formik.values?.main[index]?.condition}
                            onChange={(e) => {
                              formik.setFieldValue(
                                `${mainKey}.condition`,
                                e.target.value
                              );
                            }}
                          >
                            <FormControlLabel
                              value="AND"
                              control={<Radio />}
                              label="AND"
                            />
                            <FormControlLabel
                              value="OR"
                              control={<Radio />}
                              label="OR"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                borderRadius: "5px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  width: "60%",
                  display: "flex",
                  gap: "2vw",
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={disableButton}
                  sx={{
                    // backgroundColor: "#9b9b9b",
                    color: "#white",
                    textTransform: "capitalize",
                  }}
                  endIcon={<PlaylistAddIcon />}
                  onClick={() => {
                    setactionType("add");
                  }}
                >
                  submit
                </Button>
                {/* {segnmentCategory === "emailEngagement" && ( */}
                <Button
                  fullWidth
                  variant="contained"
                  disabled={disableButton}
                  sx={{
                    backgroundColor: "#FFDFC5 ",
                    color: "#2f2f33",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#FFDFC5",
                    },
                  }}
                  endIcon={<RefreshIcon />}
                  onClick={() => {
                    setCountValue(null);
                    setactionType("select");
                    formik.handleSubmit();
                  }}
                >
                  Count
                </Button>
                {/* // )} */}

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    border: "1px solid #9b9b9b",
                    color: "#2f2f33",
                    textTransform: "capitalize",
                  }}
                  onClick={() => closeDrawer()}
                  endIcon={<HighlightOffIcon />}
                >
                  Cancel
                </Button>
              </Box>
              {/* {segnmentCategory === "emailEngagement" && ( */}
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    color: "#e9eeff",
                    backgroundColor: "#1e88e5",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "1e88e5",
                    },
                  }}
                >
                  Count: {countValue}
                </Button>
              </Box>
              {/* // )} */}
            </Box>
          </form>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateSegment;
