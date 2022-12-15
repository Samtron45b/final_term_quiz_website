import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner10 } from "react-icons/im";
import { v4 as uuidv4 } from "uuid";
import { Form, Input } from "antd";
import SocialSignInBtns from "./socialSignInBtns";
import { publicAxios } from "../../configs/networks/custom_axioses";
import { getUserDataFromServer } from "../../auth";

function LoginPage() {
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const fetchUserData = getUserDataFromServer();

    const onFinish = async (data) => {
        setIsLoading(true);
        console.log(data);
        publicAxios
            .get(
                `auth/login?clientId=${uuidv4()}&username=${data.username}&password=${
                    data.password
                }`
            )
            .then(async (response) => {
                console.log(response);
                const { accessToken } = response.data;
                localStorage.setItem("accessToken", accessToken);
                await fetchUserData();
                navigate(location.state?.from ?? "/", { replace: true });
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

    const onFinishFailed = (error) => {
        console.log(error);
        setLoginError(error.errorFields[0].errors);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase mb-2">
                    Welcome to Let&apos;sPlay
                </h1>
                <Form
                    name="login_form"
                    layout="vertical"
                    requiredMark="optional"
                    validateTrigger="onSubmit"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        className="text-sm font-medium text-gray-700 mb-3"
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Username is required",
                                whitespace: true
                            }
                        ]}
                        help=""
                        validateStatus=""
                    >
                        <Input
                            id="username"
                            className="shadow-sm
                                focus:ring-purple-600 focus:border-purple-500
                                focus:shadow-purple-300 focus:shadow-md
                                hover:border-purple-400
                                block w-full sm:text-sm border-gray-300
                                px-2 py-2 bg-white border rounded-md "
                            placeholder="Quamon"
                        />
                    </Form.Item>

                    <Form.Item
                        className="text-sm font-medium text-gray-700 mb-3"
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Password is required."
                            },
                            {
                                pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,}$/,
                                message: "Username or password is not correct."
                            }
                        ]}
                        help=""
                        validateStatus=""
                    >
                        <div className="relative">
                            <Input
                                id="password"
                                className="shadow-sm
                                focus:ring-purple-600 focus:border-purple-500
                                focus:shadow-purple-300 focus:shadow-md
                                hover:border-purple-400
                                block w-full sm:text-sm border-gray-300
                                pl-2 pr-10 py-2 bg-white border rounded-md "
                                type={showPass ? "text" : "password"}
                                placeholder="********"
                            />
                            <div
                                className="icon_button absolute right-4 top-2"
                                onClick={() => {
                                    setShowPass(!showPass);
                                }}
                                aria-hidden="true"
                            >
                                {showPass ? (
                                    <FaEye className="w-5 h-5 text-purple-400" />
                                ) : (
                                    <FaEyeSlash className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <>
                            <div className="forgot-pwd-btn mb-2">
                                <Link
                                    to="/register"
                                    className=" text-sm font-medium text-gray-500 no-underline hover:underline hover:decoration-2 hover:text-purple-800"
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
                                    className="w-full px-4 py-2 tracking-wide text-white font-medium text-lg transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                                >
                                    {isLoading ? (
                                        <div className="flex justify-center items-center">
                                            <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                                            Signing in
                                        </div>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>
                            </div>
                            <p className="text-red-600 mt-1 text-md">{loginError}</p>
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
                        </>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
