import { Autocomplete, Box, Button, Drawer, TextField } from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Typography } from "@mui/joy";
import { useState } from "react";
import { useEffect } from "react";
import {
  EverFlowAffiliatesOffer,
  EverFlowNetworksDetailsOffer,
  EverFlowOffersDetailsOffer,
  addOfferData,
  getUpdateDataOffer,
  networkPortalListDetailsOffer,
} from "services/presets/offer";
import { createdByName, createdBy } from "../../../../helpers/userInfo";
const validationSchema = Yup.object().shape({
  networkPortalList: Yup.mixed().required("Network portal list required"),
  offerUrl: Yup.string().required("OfferUrl field  required"),
  EverFlowNetworks: Yup.mixed().when("networkPortalList", {
    is: (val) => val?.networkPortalName === "Everflow",
    then: Yup.mixed().required("Ever flow network field is required"),
  }),
  EverFlowOffers: Yup.mixed().when("networkPortalList", {
    is: (val) => val?.networkPortalName === "Everflow",
    then: Yup.mixed().required("Ever flow network offer is required"),
  }),
  NetworkAffiliates: Yup.mixed().when("networkPortalList", {
    is: (val) => val?.networkPortalName === "Everflow",
    then: Yup.mixed().required("Affiliates field is required"),
  }),
  Advertiser: Yup.mixed().when("networkPortalList", {
    is: (val) => val?.networkPortalName === "Zappian",
    then: Yup.mixed().required("Advertiser field is required"),
  }),
  Offer: Yup.mixed().when("networkPortalList", {
    is: (val) => val?.networkPortalName === "Zappian",
    then: Yup.mixed().required("Offer field is required"),
  }),
  personalUnsub: Yup.string()
    .trim()
    .required("Personal Unsub required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
  networkUnsub: Yup.string()
    .trim()
    .required("Network Unsub required")
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Only one space is allowed between words "),
});
const OfferDrawer = ({
  openActive,
  setOpenActive,
  defaultValues,
  getDataRender,
  setDefaultValues,
}) => {
  const [networkPortalList, setNetworkPortalList] = useState([]);
  const [EverFlowNetworks, setEverFlowNetworks] = useState([]);
  const [EverFlowOffers, setEverFlowOffers] = useState([]);
  const [preFilledData, setPreFilledData] = useState("");
  const [receivedData, setReceivedData] = useState({});
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [NetworkAffiliates, setNetworkAffiliates] = useState([]);
  const defaultValueslength = Object.keys(defaultValues).length;
  console.log(defaultValueslength, "defaultValueslength");

  useEffect(() => {
    networkPortalListDetails();
    // EverFlowNetworksDetails();
    networkAffiliatesDetails();
  }, []);

  const networkPortalListDetails = async () => {
    const data = await networkPortalListDetailsOffer();
    setNetworkPortalList(data.data);
  };

  const networkAffiliatesDetails = async () => {
    const data = await EverFlowAffiliatesOffer();
    setNetworkAffiliates(data.data.data);
  };

  const EverFlowNetworksDetails = async (id) => {
    const data = await EverFlowNetworksDetailsOffer(id);
    setEverFlowNetworks(data?.data?.data);
  };
  const EverFlowOffersDetails = async (id) => {
    const data = await EverFlowOffersDetailsOffer(id);
    setEverFlowOffers(data?.data?.data);
  };

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length) {
      setReceivedData(defaultValues);
      setFieldValues(defaultValues);
    } else {
      formik.resetForm();
    }
  }, [defaultValues]);

  const setFieldValues = (values) => {
    //
    ////////
    let EverFlowNetworksName = "";

    if (defaultValues?.EverFlowNetworks) {
      try {
        const parsedEverFlowNetworks = JSON.parse(
          defaultValues?.EverFlowNetworks
        );
        EverFlowNetworksName = parsedEverFlowNetworks;
        console.log("EverFlowNetworksName", EverFlowNetworksName);
      } catch (e) {
        console.error("Failed to parse networkPortalList:", e);
      }
    }

    /////
    let EverFlowAffiliatesName = "";

    if (defaultValues?.EverFlowAffiliates) {
      try {
        const parsedEverFlowAffiliatesName = JSON.parse(
          defaultValues?.EverFlowAffiliates
        );
        EverFlowAffiliatesName = parsedEverFlowAffiliatesName;
        // console.log("EverFlowNetworksName", EverFlowNetworksName);
      } catch (e) {
        console.error("Failed to parse networkPortalList:", e);
      }
    }
    /////
    let EverFlowOffersName = "";

    if (defaultValues?.EverFlowOffers) {
      try {
        const parsedEverFlowOffers = JSON.parse(defaultValues?.EverFlowOffers);
        EverFlowOffersName = parsedEverFlowOffers;
        // console.log("EverFlowNetworksName", EverFlowNetworksName);
      } catch (e) {
        console.error("Failed to parse networkPortalList:", e);
      }
    }
    console.log(values, "values");

    let networkPortalName = "";

    if (values.networkPortalList) {
      try {
        const parsedNetworkPortalList = JSON.parse(values?.networkPortalList);
        networkPortalName = parsedNetworkPortalList;
        console.log("parsedNetworkPortalList", networkPortalName);
      } catch (e) {
        console.error("Failed to parse networkPortalList:", e);
      }
    }

    formik.setFieldValue("EverFlowOffers", EverFlowOffersName);
    formik.setFieldValue("EverFlowNetworks", EverFlowNetworksName);
    formik.setFieldValue("networkPortalList", networkPortalName);
    formik.setFieldValue(
      "offer_name",
      defaultValues?.offer_name ? defaultValues?.offer_name : ""
    );
    formik.setFieldValue("NetworkAffiliates", EverFlowAffiliatesName);
    formik.setFieldValue("Advertiser", defaultValues?.EverFlowNetworksName);
    formik.setFieldValue("Offer", defaultValues?.EverFlowOffersName);

    formik.setFieldValue(
      "offerUrl",
      defaultValues?.offer_link ? defaultValues?.offer_link : ""
    );
    formik.setFieldValue(
      "personalUnsub",
      defaultValues?.personal_unsub ? defaultValues?.personal_unsub : ""
    );
    formik.setFieldValue(
      "networkUnsub",
      defaultValues?.network_unsub ? defaultValues?.network_unsub : ""
    );
    setTimeout(() => {
      formik.validateField("EverFlowNetworks");
      formik.validateField("networkPortalList");
      formik.validateField("EverFlowOffers");
      formik.validateField("offer_name");
      formik.validateField("offerUrl");
      formik.validateField("personalUnsub");
      formik.validateField("networkUnsub");
      formik.validateField("NetworkAffiliates");
      formik.validateField("Advertiser");
      formik.validateField("Offer");
    }, 0);
  };

  const getData = async (data) => {
    try {
      await addOfferData(data);
      getDataRender();
      setOpenActive({ drawer: false });
      setDefaultValues({});
      formik.resetForm();
      setButtonDisabled(false);
    } catch (error) {
      setButtonDisabled(false);
    }
  };

  const getUpdateData = async (data) => {
    try {
      await getUpdateDataOffer(receivedData?.offer_id, data);
      getDataRender();
      setOpenActive({ drawer: false });
      setDefaultValues({});
      formik.resetForm();
      setButtonDisabled(false);
    } catch (error) {
      setButtonDisabled(false);
    }
  };
  console.log(defaultValues, "defaultValues");

  const formik = useFormik({
    initialValues: {
      // offer_name: '',
      networkPortalList: null,
      EverFlowNetworks: null,
      EverFlowOffers: null,
      offerUrl: "",
      personalUnsub: "",
      networkUnsub: "",
      NetworkAffiliates: null,
      Advertiser: "",
      Offer: "",
    },
    validationSchema,
    onSubmit: (values) => {
      let data = {};
      if (formik.values.networkPortalList?.networkPortalName === "Everflow") {
        data = {
          offer_name: preFilledData?.name,
          networkPortalList: values?.networkPortalList,
          network_advertiser_id: preFilledData?.network_advertiser_id,
          vertical_id: 1,
          category_id: 1,
          personal_unsub: values.personalUnsub.trim(),
          offer_link: values.offerUrl,
          network_unsub: values.networkUnsub.trim(),
          payment_type: preFilledData?.revenue_type,
          payout: preFilledData?.payout_amount,
          trackier_id: 1,
          network_id: preFilledData?.network_advertiser_id,
          network_offer_id: preFilledData?.network_offer_id,
          created_by: createdBy,
          creator_name: createdByName,
          EverFlowNetworks: values.EverFlowNetworks,
          EverFlowOffers: values.EverFlowOffers,
          EverFlowAffiliates: values.NetworkAffiliates,
        };
      } else {
        data = {
          offer_name: values?.Offer.trim(),
          networkPortalList: values?.networkPortalList,
          network_advertiser_id: preFilledData?.network_advertiser_id,
          vertical_id: 1,
          category_id: 1,
          personal_unsub: values.personalUnsub.trim(),
          offer_link: values.offerUrl,
          network_unsub: values.networkUnsub.trim(),
          payment_type: preFilledData?.revenue_type,
          payout: preFilledData?.payout_amount,
          trackier_id: 1,
          network_id: preFilledData?.network_advertiser_id,
          network_offer_id: preFilledData?.network_offer_id,
          created_by: createdBy,
          creator_name: createdByName,
          EverFlowNetworks: {
            network_advertiser_id: null,
            name: values?.Advertiser.trim(),
          },
          EverFlowOffers: {
            network_offer_id: null,
            name: values?.Offer.trim(),
          },
          EverFlowAffiliates: { network_affiliate_id: null, name: null },
        };
      }

      ////
      let networkPortalName = "";

      if (defaultValues.networkPortalList) {
        try {
          const parsedNetworkPortalList = JSON.parse(
            defaultValues?.networkPortalList
          );
          networkPortalName = parsedNetworkPortalList?.networkPortalName;
          console.log("parsedNetworkPortalList", networkPortalName);
        } catch (e) {
          console.error("Failed to parse networkPortalList:", e);
        }
      }
      console.log(networkPortalName, "networkPortalName");

      const updatedData = {
        offer_name:
          networkPortalName === "Zappian"
            ? values?.Offer.trim()
            : preFilledData?.name,
        networkPortalList: values?.networkPortalList,
        vertical_id: 1,
        category_id: 1,
        personal_unsub: values.personalUnsub.trim(),
        offer_link: values.offerUrl,
        network_unsub: values.networkUnsub.trim(),
        payment_type: preFilledData?.revenue_type,
        payout: preFilledData?.payout_amount,
        trackier_id: 1,
        network_id: preFilledData?.network_advertiser_id,
        network_offer_id: preFilledData?.network_offer_id,
        created_by: createdBy,
        creator_name: createdByName,
        EverFlowNetworks:
          networkPortalName === "Zappian"
            ? {
                network_advertiser_id: null,
                name: values?.Advertiser.trim(),
              }
            : values.EverFlowNetworks,
        EverFlowOffers:
          networkPortalName === "Zappian"
            ? { network_offer_id: null, name: values?.Offer.trim() }
            : values.EverFlowOffers,
        EverFlowAffiliates: values.NetworkAffiliates,
      };

      console.log(updatedData, "updatedData");

      if (defaultValueslength === 0) {
        getData(data);
        setButtonDisabled(true);
      } else {
        getUpdateData(updatedData);
        setButtonDisabled(true);
      }
    },
  });
  return (
    <>
      <Drawer anchor="right" open={openActive}>
        <Box
          sx={{
            m: 1,
            width: "350px",
            margin: "24px",
          }}
          noValidate
          autoComplete="off"
        >
          <form onSubmit={formik.handleSubmit}>
            <div>
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "1.3rem",
                  mt: 4,
                }}
              >
                {defaultValueslength === 0
                  ? " Add Offer List"
                  : " Update Offer List"}
              </Typography>
            </div>
            <div
              style={{
                marginTop: "20px",
              }}
            >
              {defaultValueslength === 0 ? (
                <>
                  {" "}
                  <Autocomplete
                    fullWidth
                    id="networkPortalList"
                    name="networkPortalList"
                    options={networkPortalList}
                    disableClearable
                    value={formik.values.networkPortalList}
                    getOptionLabel={(option) => option.networkPortalName}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("networkPortalList", newValue);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Network Portal List"
                        variant="standard"
                      />
                    )}
                  />
                </>
              ) : (
                <>
                  <Autocomplete
                    fullWidth
                    id="networkPortalList"
                    name="networkPortalList"
                    options={networkPortalList}
                    disableClearable
                    disabled={true} // Disable the Autocomplete component
                    value={formik.values.networkPortalList}
                    getOptionLabel={(option) => option.networkPortalName}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("networkPortalList", newValue);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Network Portal List"
                        variant="standard"
                      />
                    )}
                  />
                </>
              )}
            </div>
            {formik.touched.networkPortalList &&
              formik.errors.networkPortalList && (
                <div style={{ color: "red" }}>
                  {formik.errors.networkPortalList}
                </div>
              )}
            {formik.values.networkPortalList?.networkPortalName ===
              "Everflow" && (
              <>
                <div>
                  <Autocomplete
                    fullWidth
                    id="NetworkAffiliates"
                    name="NetworkAffiliates"
                    options={NetworkAffiliates}
                    disableClearable
                    value={formik.values.NetworkAffiliates}
                    getOptionLabel={(option) => option?.name}
                    onChange={(event, newValue) => {
                      formik.setFieldValue("NetworkAffiliates", newValue);
                      console.log(newValue, "newwwwww");
                      EverFlowNetworksDetails(newValue?.network_id);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Affiliates"
                        variant="standard"
                      />
                    )}
                  />
                </div>
                {formik.touched.NetworkAffiliates &&
                  formik.errors.NetworkAffiliates && (
                    <div style={{ color: "red" }}>
                      {formik.errors.NetworkAffiliates}
                    </div>
                  )}
                <div>
                  <Autocomplete
                    id="EverFlowNetworks"
                    name="EverFlowNetworks"
                    options={EverFlowNetworks}
                    fullWidth
                    disableClearable
                    value={formik.values.EverFlowNetworks}
                    getOptionLabel={(option, i) => option?.name}
                    onChange={(event, newValue) => {
                      console.log(newValue);
                      formik.setFieldValue("EverFlowNetworks", newValue);
                      formik.setFieldValue("EverFlowOffers", null);
                      formik.setFieldValue("offerUrl", "");

                      EverFlowOffersDetails(newValue?.network_advertiser_id);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ever Flow Networks"
                        variant="standard"
                      />
                    )}
                  />
                </div>
                {formik.touched.EverFlowNetworks &&
                  formik.errors.EverFlowNetworks && (
                    <div style={{ color: "red" }}>
                      {formik.errors.EverFlowNetworks}
                    </div>
                  )}
                <div>
                  <Autocomplete
                    id="EverFlowOffers"
                    name="EverFlowOffers"
                    options={EverFlowOffers}
                    fullWidth
                    disableClearable
                    value={formik.values.EverFlowOffers}
                    getOptionLabel={(option, i) => option?.name}
                    onChange={(event, newValue) => {
                      console.log(newValue);
                      setPreFilledData(newValue);
                      formik.setFieldValue(
                        "offerUrl",
                        newValue?.destination_url
                      );
                      formik.setFieldValue("EverFlowOffers", newValue);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ever Flow Networks Offers"
                        variant="standard"
                      />
                    )}
                  />
                </div>
                {formik.touched.EverFlowOffers &&
                  formik.errors.EverFlowOffers && (
                    <div style={{ color: "red" }}>
                      {formik.errors.EverFlowOffers}
                    </div>
                  )}
              </>
            )}
            {formik.values.networkPortalList?.networkPortalName ===
              "Zappian" && (
              <>
                <div>
                  <TextField
                    id="Advertiser"
                    name="Advertiser"
                    label="Advertiser"
                    variant="standard"
                    fullWidth
                    value={formik.values.Advertiser}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.Advertiser && formik.errors.Advertiser && (
                    <div style={{ color: "red" }}>
                      {formik.errors.Advertiser}
                    </div>
                  )}
                </div>
                <div>
                  <TextField
                    id="Offer"
                    name="Offer"
                    label="Offer"
                    variant="standard"
                    fullWidth
                    value={formik.values.Offer}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.Offer && formik.errors.Offer && (
                    <div style={{ color: "red" }}>{formik.errors.Offer}</div>
                  )}
                </div>
              </>
            )}
            {formik.values.networkPortalList?.networkPortalName ===
            "Zappian" ? (
              <div>
                <TextField
                  id="offerUrl"
                  name="offerUrl"
                  label="Offer Url"
                  variant="standard"
                  fullWidth
                  value={formik.values.offerUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.offerUrl && formik.errors.offerUrl && (
                  <div style={{ color: "red" }}>{formik.errors.offerUrl}</div>
                )}
              </div>
            ) : (
              <div>
                <TextField
                  InputProps={{ readOnly: true }}
                  fullWidth
                  id="offerUrl"
                  name="offerUrl"
                  label="Offer Url"
                  variant="standard"
                  value={formik.values.offerUrl}
                />
                {formik.touched.offerUrl && formik.errors.offerUrl && (
                  <div style={{ color: "red" }}>{formik.errors.offerUrl}</div>
                )}
              </div>
            )}
            <div>
              <TextField
                id="personalUnsub"
                name="personalUnsub"
                label="Personal Unsub"
                variant="standard"
                fullWidth
                value={formik.values.personalUnsub}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.personalUnsub && formik.errors.personalUnsub && (
              <div style={{ color: "red" }}>{formik.errors.personalUnsub}</div>
            )}
            <div>
              <TextField
                id="networkUnsub"
                name="networkUnsub"
                label="Network Unsub"
                variant="standard"
                fullWidth
                value={formik.values.networkUnsub}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.networkUnsub && formik.errors.networkUnsub && (
              <div style={{ color: "red" }}>{formik.errors.networkUnsub}</div>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                onClick={() => {
                  setOpenActive({ drawer: false });
                  setFieldValues(defaultValues);
                  formik.resetForm();
                  setDefaultValues({});
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                disabled={isButtonDisabled}
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  );
};

export default OfferDrawer;
