import React from "react";
import Main from "../pages/main";
import RegisterForm from "../components/registerForm";
import LoginForm from "../components/loginForm";

const ViewRoutes = [
    {
        path: "/",
        exact: true,
        component: <Main />
    },
    {
        path: "/register",
        exact: true,
        component: <RegisterForm />
    },
    {
        path: "/login",
        exact: true,
        component: <LoginForm />
    }
];

export default ViewRoutes;
