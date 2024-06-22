export const initialStatedataManagementReducer = {
  listTable: [],
  supressionTable: [],
  emailEngagementTable: [],
  emailFlushTable: [],
};

const dataManagement = (state = initialStatedataManagementReducer, action) => {
  switch (action.type) {
    case "SET_LIST_TABLE":
      return {
        ...state,
        listTable: action.payload,
      };
    case "SET_SUPRESSION_TABLE":
      return {
        ...state,
        supressionTable: action.payload,
      };
    case "SET_EMAIL_ENGAGEMENT_TABLE":
      return {
        ...state,
        emailEngagementTable: action.payload,
      };
    case "SET_EMAIL_FLUSH_TABLE":
      return {
        ...state,
        emailFlushTable: action.payload,
      };
    default:
      return state;
  }
};

export default dataManagement;
