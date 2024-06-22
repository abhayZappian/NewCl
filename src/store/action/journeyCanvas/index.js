export const setJourneyObject = (payload) => ({
  type: "SET_JOURNEY",
  payload,
});
export const clearFormData = (payload) => ({
  type: "CLEAR_FORM_DATA",
  payload,
});
export const setJourneyName = (payload) => ({
  type: "SET_JOURNEY_NAME",
  payload,
});
export const setDrawerOpen = (payload) => ({
  type: "SET_DRAWER_OPEN",
  payload,
});
export const setSelectedNodeType = (payload) => ({
  type: "SET_SELECTED_NODE_TYPE",
  payload,
});
export const setSelectedNodeId = (payload) => ({
  type: "SET_SELECTED_NODE_ID",
  payload,
});
export const setFormData = (payload) => {
  // debugger;
  return {
    type: "SET_FORM_DATA",
    payload,
  };
};
export const setScheduleData = (payload) => ({
  type: "SET_SCHEDULE_DATA",
  payload,
});
export const setIspListData = (payload) => ({
  type: "SET_ISP_LIST",
  payload,
});
export const setListData = (payload) => ({
  type: "SET_LIST",
  payload,
});
export const setSegmentData = (payload) => ({
  type: "SET_SEGMENT",
  payload,
});
export const setOfferData = (payload) => ({
  type: "SET_OFFER",
  payload,
});
export const setemailServiceProviderData = (payload) => ({
  type: "SET_EMAIL_SERVICE_PROVIDER",
  payload,
});
export const setTemplateData = (payload) => ({
  type: "SET_TEMPLATE",
  payload,
});
export const setSuppressionData = (payload) => ({
  type: "SET_SUPPRESSION",
  payload,
});
export const setWebHook = (payload) => ({
  type: "SET_WEBHOOK",
  payload,
});
export const setCountryList = (payload) => ({
  type: "SET_COUNTRY_LIST",
  payload,
});
export const setEmailServiceAccountData = (payload) => ({
  type: "SET_EMAIL_SERVICE_ACCOUNT",
  payload,
});
export const setCampaignJourneyList = (payload) => ({
  type: "SET_CAMPAIGN_JOURNEY_LIST",
  payload,
});
export const deleteNode = (nodeId) => ({
  type: "DELETE_NODE",
  payload: { nodeId },
});
export const setEventData = (payload) => ({
  type: "SET_EVENT_DATA",
  payload,
});
export const setCacheListName = (payload) => ({
  type: "SET_Cache_List_Name",
  payload,
});
export const setFooterTable = (payload) => ({
  type: "SET_FOOOTER_TABLE",
  payload,
});
export const setOfferTable = (payload) => ({
  type: "SET_OFFER_TABLE",
  payload,
});
export const setNetworkTable = (payload) => ({
  type: "SET_NETWORK_TABLE",
  payload,
});
export const setTemplateTable = (payload) => ({
  type: "SET_TEMPLATE_TABLE",
  payload,
});
export const setHeaderTable = (payload) => ({
  type: "SET_HEADER_TABLE",
  payload,
});
export const setPoolTable = (payload) => ({
  type: "SET_POOL_TABLE",
  payload,
});
export const setEndNode = (payload) => ({
  type: "SET_END_NODE",
  payload,
});
export const setBeginNode = (payload) => ({
  type: "SET_BEGIN_NODE",
  payload,
});
export const setSplitBranchName = (payload) => ({
  type: "SET_SPLIT_BRANCH_NAME",
  payload,
});
