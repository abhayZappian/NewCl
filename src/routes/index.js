import { useRoutes } from "react-router-dom";

// routes
import MainRoutes from "./MainRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes"; 

// ==============================|| ROUTING RENDER ||============================== //

// const accessToken = localStorage.getItem('access_token');
// console.log('accessToken----', accessToken);

export default function ThemeRoutes() {
  return useRoutes([...MainRoutes, AuthenticationRoutes]);
}
