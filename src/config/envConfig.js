const baseURL = process.env.REACT_APP_CL_UI_BASE_URL;
const gatewayURL = process.env.REACT_APP_GATEWAY_URL;
const callBackURL = process.env.REACT_APP_CL_IDP_CALL_BACK_URL;
const idpURL = process.env.REACT_APP_IDP_URL;
const logoutURL = process.env.REACT_APP_CL_POST_LOGOUT_REDIRECT_URI; 
 
export { baseURL, idpURL, callBackURL, logoutURL, gatewayURL };
