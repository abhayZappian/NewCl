export const initialStateCommonReducer = {
  timezone: [],
  list: [],
  segmentCategory: [],
  absolutes: [],
  slot: [],
  behaviour: [],
  operators: [],
  relatives: [],
  offer: [],
  segmentFields: [],
  itemData:[]
};

const common = (state = initialStateCommonReducer, action) => {
  switch (action.type) {
    case "SET_TIME_ZONE":
      return {
        ...state,
        timezone: action.payload,
      };
    case "SET_LIST":
      return {
        ...state,
        list: action.payload,
      };
    case "SET_SEGNMENT_CATEGORY":
      return {
        ...state,
        segmentCategory: action.payload,
      };
    case "SET_ABSOLUTES":
      return {
        ...state,
        absolutes: action.payload,
      };
    case "SET_SLOT":
      return {
        ...state,
        slot: action.payload,
      };
    case "SET_BEHAVIOURS":
      return {
        ...state,
        behaviour: action.payload,
      };
    case "SET_OPERATORS":
      return {
        ...state,
        operators: action.payload,
      };
    case "SET_RELATIVES":
      return {
        ...state,
        relatives: action.payload,
      };
    case "SET_OFFERS":
      return {
        ...state,
        offer: action.payload,
      };
    case "SET_SEGMENT_FIELDS":
      return {
        ...state,
        segmentFields: action.payload,
      };
    case "SET_ITEM_DATA":
      return {
        ...state,
        itemData: action.payload,
      };
    default:
      return state;
  }
};

export default common;
