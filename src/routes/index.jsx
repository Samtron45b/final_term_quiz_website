import React from "react";
import Main from "../pages/main";
import RegisterPage from "../pages/register/index";
import LoginPage from "../pages/login/index";
import GroupDetailPage from "../pages/group_detail/index";
import AccountPage from "../pages/account/index";

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
    }
];

export default ViewRoutes;
