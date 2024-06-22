import { gatewayURL } from "config/envConfig";
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";
import { createdBy, createdByName } from "helpers/userInfo";

// -----------------------------------------------common-----------------------------------------------------------------------------------
export const getSegmentCategories = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getSegnmentCategory}`
    );
    return data;
    // setSegmentCategory(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getSegmentFields = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getSegmentField}`
    );
    return data;
    // setSegmentListFields(data.segmentFields);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//------------------------------------------------- Engagement Table ----------------------------------------------------------------------
export const getEngagementData = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getEngagementData}`
    );
    return data;
  } catch (error) {
    console.log(error);
    enqueueSnackbar(error?.response?.data?.error, {
      variant: "error",
    });
    throw error;
  }
};

export const engagementDelete = async (id) => {
  try {
    const { data } = await axiosInstance.put(
      `${gatewayURL}${apiEndPoints.deleteSegnmentRecords}/${id}`
    );
    enqueueSnackbar(data?.msg, {
      variant: "success",
    });
  } catch (error) {
    console.log(error);
    enqueueSnackbar("unable to delete", {
      variant: "error",
    });
    throw error;
  }
};

export const engagementCountRefresh = async (segmentid) => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.engagementCount}/${segmentid}`
    );
    console.log(data);
    enqueueSnackbar(data?.msg, {
      variant: "success",
    });
    return data;
  } catch (error) {
    console.log(error);
    enqueueSnackbar(`error`, {
      variant: "error",
    });
    throw error;
  }
};

export const engagementCopy = async (row) => {
  console.log(row);
  try {
    const data = {
      segmentId: row?.segmentid,
      segmentType: "emailengagement",
      created_by: createdBy,
      created_by_name: createdByName,
    };
    const res = await axiosInstance.post(
      `${gatewayURL}${apiEndPoints.copySegnment}`,
      data
    );
    console.log(res);
    enqueueSnackbar(res?.data?.msg, {
      variant: "success",
    });
    return res.data;
  } catch (error) {
    enqueueSnackbar("error ", {
      variant: "error",
    });
    throw error;
  }
};

//---------------------------------------------------- Flush Table -------------------------------------------------------------------------
export const getFlushData = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getFlushData}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const flushDelete = async (segnmentId) => {
  try {
    const data = {
      segmentType: "emailflush",
      deleted_by: createdBy,
      deleted_by_name: createdByName,
    };
    const res = await axiosInstance.put(
      `${gatewayURL}${apiEndPoints.deleteSegnmentRecords}/${segnmentId}`,
      data
    );
    enqueueSnackbar("Email Flush  Deleted Successfully !!!", {
      variant: "success",
    });
    return res;
  } catch (error) {
    console.log(error);
    enqueueSnackbar(error.res.msg, {
      variant: "error",
    });
    throw error;
  }
};

export const flushCopy = async (row) => {
  console.log(row);
  try {
    const data = {
      segmentId: row?.segmentid,
      segmentType: "emailflush",
      created_by: createdBy,
      created_by_name: createdByName,
    };
    const res = await axiosInstance.post(
      `${gatewayURL}${apiEndPoints.copySegnment}`,
      data
    );
    enqueueSnackbar("copyed successfully ", {
      variant: "success",
    });
    console.log(res, "resresresres");
    return res?.data;
  } catch (error) {
    console.log(error);
    enqueueSnackbar("error ", {
      variant: "error",
    });
    throw error;
  }
};

export const flushRecord = async (segnmentDetail) => {
  try {
    const { data } = await axiosInstance.put(
      `${gatewayURL}${apiEndPoints.flushSegnment}/${segnmentDetail}`
    );
    console.log(data);
    enqueueSnackbar(data.msg, {
      variant: "success",
    });
    console.log("flush successfully ", data);
    return data;
  } catch (error) {
    console.log(error);
    enqueueSnackbar("error ", {
      variant: "error",
    });
    throw error;
  }
};

export const flushCountRefresh = async (segnmentDetail) => {
  try {
    console.log(segnmentDetail);
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.flushCount}/${segnmentDetail}`
    );
    console.log(data);
    enqueueSnackbar(data?.msg, {
      variant: "success",
    });
    console.log(data.count);
    return data;
  } catch (error) {
    console.log(error);
    enqueueSnackbar(`error`, {
      variant: "error",
    });
    throw error;
  }
};
//----------------------------------------------------------- Segnment Drawer-------------------------------------------------------
export const addSegnmentData = async (
  values,
  closeDrawer,
  actionType,
  getDataRender,
  setCountValue,
  setDisableButton
) => {
  try {
    console.log(
      values?.main,
      "values?.mainvalues?.mainvalues?.mainvalues?.mainvalues?.main"
    );
    // debugger;
    const data = {
      postData: {
        action: actionType,
        segment_name: values?.segment_name,
        description: values?.description,
        segment_type: values?.segment_type,
        segmentDetails: {
          segment_type: values?.segment_type,
          list_id: values?.list_id?.listid,
          offer_id: values?.offer_id?.offer_id,
          segment_name: values?.segment_name,
          description: values?.description,
          main: values?.main,
        },
        list_id: values?.list_id?.listid,
        offer_id: values?.offer_id?.offer_id,
        created_by: createdBy,
        segmentCategory: values?.segmentCategory?.value,
        created_by_name: createdByName,
      },
    };
    const res = await axiosInstance.post(
      `${gatewayURL}${apiEndPoints.addSegnmentDetail}`,
      data
    );
    if (actionType === "add") {
      closeDrawer();
      enqueueSnackbar(res.data.msg, {
        variant: "success",
      });
      // formik.resetForm();
      getDataRender();
    }
    if (actionType === "select") {
      setCountValue(res?.data?.count);
      enqueueSnackbar(res.data.msg, {
        variant: "success",
      });
    }
    setDisableButton(false);
    getDataRender();
    return data;
  } catch (error) {
    console.log(error);
    enqueueSnackbar(`${error?.response?.data?.msg}`, {
      variant: "error",
    });
    setDisableButton(false);
    throw error;
  }
};

export const updateSegnmentData = async (
  values,
  closeDrawer,
  getDataRender,
  defaultValueslength,
  segmentid
) => {
  try {
    const data = {
      postData: {
        segment_name: values?.segment_name,
        description: values?.description,
        segment_type: values?.segment_type,
        segmentDetails: {
          segment_type: values?.segment_type,
          list_id: values?.list_id?.listid,
          offer_id: values?.offer_id?.offer_id,
          // vertical_id: "",
          segment_name: values?.segment_name,
          description: values?.description,
          main: values?.main,
        },
        list_id: values?.list_id?.listid,
        offer_id: values?.offer_id?.offer_id,
        // vertical_id: "",
        created_by: createdBy,
        segmentCategory: values?.segmentCategory?.value,
        created_by_name: createdByName,
      },
    };
    const  res  = await axiosInstance.put(
      `${gatewayURL}${apiEndPoints.updateSegnment}/${
        // defaultValues?.
        segmentid
      }`,
      data
    );
    console.log(res, "%%%%%%%%%%%%%%%%");
    enqueueSnackbar(res.data.msg, {
      variant: "success",
    });
    closeDrawer();
    getDataRender();
    defaultValueslength = 0;
  } catch (error) {
    enqueueSnackbar(`${error?.response?.data?.msg}`, {
      variant: "error",
    });
    throw error;
  }
};
