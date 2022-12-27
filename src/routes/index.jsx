import React from "react";
import Main from "../pages/main";
import RegisterPage from "../pages/register/index";
import LoginPage from "../pages/login/index";
import GroupDetailPage from "../pages/group_detail/index";
import AccountPage from "../pages/account/index";
import ActiveAccountPage from "../pages/activate_account";
import InviteGroupOrPresentationPage from "../pages/invite_group_or_presentation";
import PresentationEditPage from "../pages/presentation/edit/presentation_edit";
import ForgotPassPage from "../pages/forgot_pass";
import ActiveNotifyPage from "../pages/activate_account/active_notify";
import PresentationPresentPage from "../pages/presentation/present/presentation_present";

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
        path: "/forgot_password",
        exact: true,
        component: <ForgotPassPage />
    },
    {
        path: "/group_detail/:groupId",
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
        path: "/active_notify/:username",
        exact: true,
        component: <ActiveNotifyPage />
    },
    {
        path: "/:locationInvite/invite/:inviteId",
        exact: true,
        component: <InviteGroupOrPresentationPage />
    },
    {
        path: "/presentation/:presentationId/edit",
        exact: true,
        component: <PresentationEditPage />
    },
    {
        path: "/presentation/:presentationId/present",
        exact: true,
        component: <PresentationPresentPage />
    }
    // {
    //     path: "/presentation/:presentationId/host",
    //     exact: true,
    //     component: <InviteGroupOrPresentationPage />
    // },
    // {
    //     path: "/presentation/:presentationId/play",
    //     exact: true,
    //     component: <InviteGroupOrPresentationPage />
    // }
];

export default ViewRoutes;
