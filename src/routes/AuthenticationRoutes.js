import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
// import Login from 'views/login';

// login option 3 routing

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        // {
        //     path: '/login',
        //     element: <Login />
        // }
    ]
};

export default AuthenticationRoutes;
