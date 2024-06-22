export const selectGetEdges = (state) => {
  return state.journeyCanvas?.rowData?.edges;
};
export const selectGetNodes = (state) => {
  return state.journeyCanvas?.rowData?.nodes;
};

export const selectGetJourneyName = (state) => {
  return state.journeyCanvas?.journeyName;
};
export const selectGetEmailSchedule = (state) => {
  return state.journeyCanvas?.schedule;
};
export const selectGetDrawer = (state) => {
  return state.journeyCanvas?.openDrawer;
};
export const selectSelectedNodeType = (state) => {
  return state.journeyCanvas?.selectedNodeType;
};
export const selectJourneyId = (state) => {
  return state.journeyCanvas?._id;
};
export const selectCountryList = (state) => {
  return state.journeyCanvas?.countryList;
};
export const selectGetFormData = (state) => {
  return state.journeyCanvas?.rowData.formData[
    state.journeyCanvas.selectedNodeId
  ];
};
export const selectGetAllFormData = (state) => {
  return state.journeyCanvas?.rowData.formData;
};
export const selectIspListData = (state) => {
  return state.journeyCanvas?.ispList;
};
export const selectOffertData = (state) => {
  return state.journeyCanvas?.offer;
};
export const selectEmailServiceProviderData = (state) => {
  return state.journeyCanvas?.emailServiceProvider;
};
export const selectTemplateData = (state) => {
  return state.journeyCanvas?.template;
};
export const selectsuppressiondData = (state) => {
  return state.journeyCanvas?.suppression;
};
export const selectListData = (state) => {
  return state?.journeyCanvas?.list;
};
export const selectSegmentData = (state) => {
  return state?.journeyCanvas?.segment;
};
export const selectEmailServiceAccountData = (state) => {
  return state.journeyCanvas?.emailServiceAccount;
};
export const selectCampaignJourneyList = (state) => {
  return state.journeyCanvas?.campaignJourneyList;
};
export const selectWebHook = (state) => {
  return state.journeyCanvas?.webhook;
};

export const selectEventDataList = (state) => {
  return state.journeyCanvas?.eventData;
};
export const selectCacheListName = (state) => {
  return state.journeyCanvas?.cacheListName;
};
export const selectFooterTable = (state) => {
  return state.presets?.footerTable;
};
export const selectOfferTable = (state) => {
  return state.presets?.offerTable;
};
export const selectNetworkTable = (state) => {
  return state.presets?.networkTable;
};
export const selectTemplateTable = (state) => {
  return state.presets?.templateTable;
};
export const selectHeaderTable = (state) => {
  return state.presets?.headerTable;
};
export const selectPoolTable = (state) => {
  return state.presets?.poolTable;
};

export const selectListTable = (state) => {
  return state.dataManagement?.listTable;
};
export const selectSupressionTable = (state) => {
  return state.dataManagement?.supressionTable;
};
export const selectEmailEngagementTable = (state) => {
  return state.dataManagement?.emailEngagementTable;
};
export const selectEmailFlushTable = (state) => {
  return state.dataManagement?.emailFlushTable;
};
export const selectBeginNode = (state) => {
  return state.journeyCanvas?.beginNode;
};
export const selectEndNode = (state) => {
  return state.journeyCanvas?.endNode;
};
