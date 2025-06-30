import Layout from "../Components/Layout.jsx";
import SignUpPage from "../pages/SignUpPage/SignUpPage.jsx";
import OtpPage from "../pages/OtpPage/OtpPage.jsx";
import {createBrowserRouter} from "react-router-dom";
import MainPage from "../pages/MainPage.jsx";
import SignInPage from "../pages/SignInPage/SignInPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import AdminPanelPage from "../pages/AdminPanelPage.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import OrderPage from "../pages/OrderPage/OrderPage.jsx";
import TrackingComp from "../Components/Tracking/TrackingComp.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,  // базовый layout
        children: [
            {index:true, element:<MainPage/>},
            {path:'signIn', element:<SignInPage/>},
            {path:'signUp', element:<SignUpPage/>},
            {path:'verify-otp', element:<OtpPage/>},      
            {path:'profile', element:(<PrivateRoute><ProfilePage/></PrivateRoute>)},
            {path:'profile/order',element:(<PrivateRoute><OrderPage/></PrivateRoute>)},
            {path:'/track',element:<TrackingComp/>},
            {path:'/calculator', element:<OrderPage/>},
            {path:'admin', element:(
                    <AdminPanelPage/>
            )},
        ]
    }
])

export default router