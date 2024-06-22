export const initialStateJourneyReducer = {
  rowData: {
    edges: [],
    nodes: [],
    formData: {},
  },
  journeyName: "",
  active: "active",
  openDrawer: false,
  selectedNodeType: "",
  id: "",
  _id: "",
  selectedNodeId: null,
  schedule: {},
  ispList: [],
  list: [],
  segment: [],
  offer: [],
  emailServiceProvider: [],
  template: [],
  emailServiceAccount: [],
  campaignJourneyList: [],
  eventData: [],
  suppression: [],
  webhook: [],
  countryList: [],
  cacheListName: [],
  description: "false",
  createdBy: null,
  createdByName: "",
  updatedBy: 0,
  updatedByName: "false",
  journeyType: "",
  state: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
  endNode: false,
  beginNode: false,
  splitBranchName: [],
};

const journeyCanvas = (state = initialStateJourneyReducer, action) => {
  switch (action.type) {
    case "SET_JOURNEY":
      return {
        ...state,
        ...action.payload,
      };
    case "CLEAR_FORM_DATA":
      const keyToRemove = action.payload;
      if (state.rowData.formData.hasOwnProperty(keyToRemove)) {
        const updatedFormData = { ...state.rowData.formData };
        delete updatedFormData[keyToRemove];
        state.rowData.formData = updatedFormData;
      }
      return state;
    case "SET_JOURNEY_NAME":
      return {
        ...state,
        journeyName: action.payload,
      };

    case "SET_DRAWER_OPEN":
      return {
        ...state,
        openDrawer: action.payload,
      };

    case "SET_SELECTED_NODE_TYPE":
      return {
        ...state,
        selectedNodeType: action.payload,
      };
    case "SET_SELECTED_NODE_ID":
      return {
        ...state,
        selectedNodeId: action.payload,
      };

    case "SET_FORM_DATA":
      const fieldDetails = action.payload;
      // const cloneState = { ...state };
      const cloneState = structuredClone(state);
      cloneState["rowData"]["formData"][cloneState.selectedNodeId] =
        fieldDetails;
      return cloneState;

    case "SET_SCHEDULE_DATA":
      return {
        ...state,
        schedule: action.payload,
      };

    case "SET_ISP_LIST":
      return {
        ...state,
        ispList: action.payload,
      };

    case "SET_LIST":
      return {
        ...state,
        list: action.payload,
      };
    //   case "SET_SEGMENT":
    //     return {
    //       ...state,
    //       segment: action.payload,
    //     };
    case "SET_SEGMENT":
      return {
        ...state,
        segment: [...state.segment, ...action.payload],
      };

    case "SET_EVENT_DATA":
      console.log(action.payload, "payload");
      return {
        ...state,
        eventData: action.payload,
      };
    case "SET_OFFER":
      return {
        ...state,
        offer: action.payload,
      };
    case "SET_EMAIL_SERVICE_PROVIDER":
      return {
        ...state,
        emailServiceProvider: action.payload,
      };
    case "SET_TEMPLATE":
      return {
        ...state,
        template: action.payload,
      };
    case "SET_SUPPRESSION":
      return {
        ...state,
        suppression: action.payload,
      };
    case "SET_WEBHOOK":
      return {
        ...state,
        webhook: action.payload,
      };
    case "SET_EMAIL_SERVICE_ACCOUNT":
      return {
        ...state,
        template: action.payload,
      };
    case "SET_CAMPAIGN_JOURNEY_LIST":
      return {
        ...state,
        campaignJourneyList: action.payload,
      };
    case "SET_COUNTRY_LIST":
      return {
        ...state,
        countryList: action.payload,
      };
    case "DELETE_NODE":
      const { nodeId } = action.payload;
      const updatedNodes = state.rowData.nodes.filter(
        (node) => node.id !== nodeId
      );
      return { ...state, nodes: updatedNodes };
    case "SET_Cache_List_Name":
      const updatedCacheList = [...state.cacheListName];
      const queryExistsIndex = updatedCacheList.findIndex(
        (item) => Object.keys(item)[0] === Object.keys(action.payload)[0]
      );
      if (queryExistsIndex !== -1) {
        updatedCacheList[queryExistsIndex] = action.payload;
      } else {
        updatedCacheList.push(action.payload);
      }
      return {
        ...state,
        cacheListName: updatedCacheList,
      };
    case "SET_BEGIN_NODE":
      return {
        ...state,
        beginNode: action.payload,
      };
    case "SET_END_NODE":
      return {
        ...state,
        endNode: action.payload,
      };
    case "SET_SPLIT_BRANCH_NAME":
      return {
        ...state,
        splitBranchName: action.payload,
      };
    default:
      return state;
  }
};

export default journeyCanvas;
