import React from "react";
import Main from "../pages/main";
import RegisterPage from "../pages/register/index";
import LoginPage from "../pages/login/index";
import GroupDetailPage from "../pages/group_detail/index";
import AccountPage from "../pages/account/index";
import ActiveAccountPage from "../pages/activate_account";

const ViewRoutes = [
    {
        path: "/",
        exact: true,
        component: <Main />
    },
    {
        path: "/register",
        exact: true,
        component: <RegisterPage />
    },
    {
        path: "/login",
        exact: true,
        component: <LoginPage />
    },
    {
        path: "/group_detail/:groupname",
        exact: true,
        component: <GroupDetailPage />
    },
    {
        path: "/account/:username",
        exact: true,
        component: <AccountPage />
    },
    {
        path: "/activate_account/:username",
        exact: true,
        component: <ActiveAccountPage />
    },
    {
        path: "/invite/:groupname",
        exact: true,
        component: <ActiveAccountPage />
    }
];

export default ViewRoutes;
