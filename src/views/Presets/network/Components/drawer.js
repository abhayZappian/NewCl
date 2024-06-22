import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  EverFlowNetworksDetail,
  addNetwork,
  networkPortalListDetail,
  updateNetwork,
} from "services/presets/network";
import { createdByName, createdBy } from "../../../../helpers/userInfo";
const validationSchema = Yup.object().shape({
  networkPortalList: Yup.mixed().required(
    "Network portal list field is required"
  ),
  EverFlowNetworks: Yup.mixed().when("networkPortalList", {
    is: (val) => val?.networkPortalName === "Everflow",
    then: Yup.mixed().required("Ever flow networks field is required"),
  }),
  zappian_network_name: Yup.string().when("networkPortalList", {
    is: (val) => val?.networkPortalName === "Zappian",
    then: Yup.string()
      .trim()
      .required("Zappian networks field is required")
      .matches(
        /^[^\s]+(\s[^\s]+)*$/,
        "Only one space is allowed between words in the network name"
      ),
  }),
});

const NetworkDrawer = ({
  defaultValues,
  setDefaultValues,
  addNetworkDataRender,
  isDrawerOpen,
  setIsDrawerOpen,
  getDataRender,
}) => {
  const Dispatch = useDispatch();
  const [receivedData, setReceivedData] = useState({});
  const [networkPortalList, setNetworkPortalList] = useState([]);
  const [EverFlowNetworks, setEverFlowNetworks] = useState([]);
  const [preFilledData, setPreFilledData] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const defaultValueslength = Object.keys(defaultValues).length;

  const networkPortalListDetails = async (id) => {
    const data = await networkPortalListDetail();
    setNetworkPortalList(data);
  };
  const EverFlowNetworksDetails = async (id) => {
    const data = await EverFlowNetworksDetail();
    setEverFlowNetworks(data);
  };
  useEffect(() => {
    networkPortalListDetails();
    EverFlowNetworksDetails();
  }, []);

  useEffect(() => {
    setReceivedData(defaultValues);
    if (defaultValues && Object.keys(defaultValues).length) {
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);

  const setFieldValues = (values) => {
    const ab = EverFlowNetworks.find((res) =>
      res.name === defaultValues?.network_advertiser_name
        ? defaultValues?.network_advertiser_name
        : ""
    );
    const cd = networkPortalList.find((res) =>
      res.networkPortalName === defaultValues?.networkPortalName
        ? defaultValues?.networkPortalName
        : ""
    );
    formik.setFieldValue("networkPortalList", cd);
    formik.setFieldValue("EverFlowNetworks", ab);
    formik.setFieldValue("zappian_network_name", defaultValues?.network_name);
    setTimeout(() => {
      formik.validateField("networkPortalList");
      formik.validateField("EverFlowNetworks");
      formik.validateField("zappian_network_name");
    }, 0);
  };
  const addNetworkData = async (data) => {
    try {
      const res = await addNetwork(data);
      if (res) {
        setIsDrawerOpen(false);
        setTimeout(() => {
          formik.resetForm();
        }, 1000);
        setButtonDisabled(false);
        setDefaultValues({});
        formik.resetForm();
        getDataRender();
      }
    } catch (error) {
      setButtonDisabled(false);
    }
  };

  const updateNetworkData = async (data) => {
    try {
      const res = await updateNetwork(receivedData?.network_id, data);
      if (res) {
        setIsDrawerOpen(false);
        setTimeout(() => {
          formik.resetForm();
        }, 1000);
        setButtonDisabled(false);
        setDefaultValues({});
        formik.resetForm();
        getDataRender();
      }
    } catch (error) {
      setButtonDisabled(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      networkPortalList: null,
      EverFlowNetworks: null,
      zappian_network_name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      let data = {};

      if (formik.values.networkPortalList?.networkPortalName === "Everflow") {
        data = {
          network_name: preFilledData?.name,
          networkPortalList: values.networkPortalList,
          contactNumber:
            preFilledData?.relationship?.account_manager?.cell_phone,
          countryId: 1,
          countryName: "IND",
          trackier_id: "",
          emailId: preFilledData?.relationship?.account_manager?.email,
          address: preFilledData?.platform_username,
          pocName: preFilledData?.relationship?.sale_manager?.first_name,
          pocContactNumber: preFilledData?.relationship?.sale_manager?.cell_phone,
          pocEmailId: preFilledData?.relationship?.sale_manager?.email,
          pocAddress: preFilledData?.platform_username,
          network_advertiser_id: preFilledData?.network_advertiser_id,
          network_advertiser_name: preFilledData?.name,
          created_by: createdBy,
          creator_name: createdByName,
        };
      } else {
        data = {
          address: "zappianmedia",
          contactNumber: "",
          countryId: 1,
          countryName: "IND",
          created_by: createdBy,
          creator_name: createdByName,
          emailId: "",
        //   networkPortalList: {
        //       _id: "658a7283272de4b8603ee210",
        //       networkPortalName: "Zappian",
        //       active: "Active",
        //     },
          networkPortalList: values.networkPortalList,
          network_advertiser_id: null,
          network_advertiser_name: values.zappian_network_name.trim(),
          network_name: values.zappian_network_name.trim(),
          pocAddress: "zappianmedia",
          pocContactNumber: "",
          pocEmailId: "",
          pocName: "",
          trackier_id: "",
        };
      }
      if (defaultValueslength === 0) {
        addNetworkData(data);
        setButtonDisabled(true);
      } else {
        updateNetworkData(data);
        setButtonDisabled(true);
      }
    },
  });

  return (
    <>
      <Drawer anchor="right" open={isDrawerOpen}>
        <Box
          sx={{ m: 1, width: "350px", margin: "24px" }}
          noValidate
          autoComplete="off"
        >
          <div>
            <form onSubmit={formik.handleSubmit}>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "1.3rem",
                  mt: 4,
                }}
              >
                Network Details
              </Typography>

              <div>
                <Autocomplete
                  fullWidth
                  disableClearable
                  id="networkPortalList"
                  name="networkPortalList"
                  options={networkPortalList}
                  value={formik.values.networkPortalList}
                  getOptionLabel={(option) => option.networkPortalName}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    formik.setFieldValue("networkPortalList", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField {...params} label="Portals" variant="standard" />
                  )}
                />
              </div>
              {formik.touched.networkPortalList &&
                formik.errors.networkPortalList && (
                  <div style={{ color: "red" }}>
                    {formik.errors.networkPortalList}
                  </div>
                )}
              {formik.values.networkPortalList?.networkPortalName ===
                "Everflow" && (
                <div>
                  <Autocomplete
                    disableClearable
                    id="EverFlowNetworks"
                    name="EverFlowNetworks"
                    options={EverFlowNetworks}
                    fullWidth
                    value={formik.values.EverFlowNetworks}
                    getOptionLabel={(option, i) => option?.name}
                    onChange={(event, newValue) => {
                      setPreFilledData(newValue);
                      formik.setFieldValue("EverFlowNetworks", newValue);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Networks"
                        variant="standard"
                      />
                    )}
                  />
                  {formik.touched.EverFlowNetworks &&
                    formik.errors.EverFlowNetworks && (
                      <div style={{ color: "red" }}>
                        {formik.errors.EverFlowNetworks}
                      </div>
                    )}
                </div>
              )}

              {formik.values.networkPortalList?.networkPortalName ===
                "Zappian" && (
                <div>
                  <div style={{ width: "350px" }}>
                    <TextField
                      fullWidth
                      id="zappian_network_name"
                      variant="standard"
                      label="Networks"
                      name="zappian_network_name"
                      value={formik.values.zappian_network_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.zappian_network_name &&
                    formik.errors.zappian_network_name && (
                      <div style={{ color: "red" }}>
                        {formik.errors.zappian_network_name}
                      </div>
                    )}
                </div>
              )}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setFieldValues(defaultValues);
                    formik.resetForm();
                    setDefaultValues({});
                  }}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // setDefaultValues({});
                  }}
                  disabled={isButtonDisabled}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </Box>
            </form>
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default NetworkDrawer;
