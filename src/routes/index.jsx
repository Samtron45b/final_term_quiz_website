import React from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

const ViewRoutes = [
    {
        path: "/",
        exact: true,
        component: <RegisterForm />
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
