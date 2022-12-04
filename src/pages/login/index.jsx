import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner10 } from "react-icons/im";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "../../components/contexts/auth_context";
import LocationContext from "../../components/contexts/location_context";
import SocialSignInBtns from "./socialSignInBtns";

function LoginPage() {
    const { location, setLocation } = useContext(LocationContext);

    const { setUser } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: "onSubmit",
        reValidateMode: "onSubmit"
    });
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (location === "/login") setLocation(null);
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);
        axios
            .get(
                `${process.env.REACT_APP_BASE_URL}auth/login?clientId=${uuidv4()}&username=${
                    data.username
                }&password=${data.password}`
            )
            .then((response) => {
                console.log(response);
                const { accessToken } = response.data.data;
                localStorage.setItem("accessToken", accessToken);
                const decode = jwtDecode(accessToken, "letsplay");
                setUser({
                    displayName: decode.displayName,
                    username: decode.name,
                    avatar: decode.avatar
                        ? decode.avatar
                        : "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                });
                navigate(location ?? "/", { replace: true });
                setLoginError(null);
                setIsLoading(false);
            })
            .catch((loginErr) => {
                console.log(loginErr.response);
                if (
                    loginErr.response.data.isActive !== undefined &&
                    !loginErr.response.data.isActive
                ) {
                    setLoginError(
                        "This account has not been activated. Please active by verify your email first then try to sign in again."
                    );
                } else {
                    setLoginError("Username or Password is not correct.");
                }
                setIsLoading(false);
            });
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                    Sign in
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="username-input mb-3">
                        <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="username"
                        >
                            Username
                            <input
                                name="username"
                                className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                                id="username"
                                type="text"
                                placeholder="Quamon"
                                {...register("username", { required: "Username is required" })}
                            />
                        </label>
                    </div>
                    <div className="password-input mb-3">
                        <label
                            className="block text-sm font-medium text-gray-700 relative"
                            htmlFor="password"
                        >
                            Password
                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                                id="password"
                                placeholder="********"
                                {...register("password", {
                                    required: "Password is required.",
                                    pattern: {
                                        value: /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,}$/,
                                        message: "Username or Password is not correct."
                                    }
                                })}
                            />
                            <div
                                className="icon_button absolute right-4 top-8"
                                onClick={() => {
                                    setShowPass(!showPass);
                                }}
                                aria-hidden="true"
                            >
                                {showPass ? (
                                    <FaEye className="w-5 h-5" />
                                ) : (
                                    <FaEyeSlash className="w-5 h-5" />
                                )}
                            </div>
                        </label>
                    </div>
                    <div className="forgot-pwd-btn mb-2">
                        <Link
                            to="/register"
                            className=" text-sm text-gray-500 no-underline hover:underline hover:text-blue-800"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="mt-6">
                        <button
                            disabled={isLoading}
                            type="submit"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            // onClick={() => setIsLoading(true)}
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                                    Signing in
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                    <p className="text-red-600 mt-1 text-md">
                        {errors.username?.message || errors.password?.message || loginError}
                    </p>
                    <div className="mt-3 text-gray-500 text-center">
                        <span>Don&#39;t have account?</span>&nbsp;
                        <Link
                            to="/register"
                            className="no-underline hover:no-underline hover:text-purple-700 font-bold"
                        >
                            Sign up
                        </Link>
                    </div>
                    <div className="relative flex items-center justify-center w-full mt-3 border border-t">
                        <div className="absolute px-3 bg-white">Or</div>
                    </div>
                    <div className="text-center mt-4 text-purple-600 font-semibold">
                        Sign in with
                    </div>
                    <SocialSignInBtns />
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
