export const initialStatePresetsReducer = {
    footerTable: [],
    offerTable: [],
    networkTable: [],
    templateTable: [],
    headerTable: [],
    poolTable: []
};

const presets = (state = initialStatePresetsReducer, action) => {
    switch (action.type) {
        case 'SET_FOOOTER_TABLE':
            return {
                ...state,
                footerTable: action.payload
            };
        case 'SET_OFFER_TABLE':
            return {
                ...state,
                offerTable: action.payload
            };
        case 'SET_NETWORK_TABLE':
            return {
                ...state,
                networkTable: action.payload
            };
        case 'SET_TEMPLATE_TABLE':
            return {
                ...state,
                templateTable: action.payload
            };
        case 'SET_HEADER_TABLE':
            return {
                ...state,
                headerTable: action.payload
            };
        case 'SET_POOL_TABLE':
            return {
                ...state,
                poolTable: action.payload
            };
        default:
            return state;
    }
};

export default presets;
