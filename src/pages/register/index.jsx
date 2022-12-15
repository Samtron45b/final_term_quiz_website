import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner10 } from "react-icons/im";
import { v4 as uuidv4 } from "uuid";
import { Form, Input } from "antd";
import ModalFrame from "../../components/modals/modal_frame";
import AuthResultModalBody from "../../components/modals/auth_result_modal_body";
import { publicAxios } from "../../configs/networks/custom_axioses";

function RegisterPage() {
    const [form] = Form.useForm();

    const [showPass, setShowPass] = useState(false);
    const [showRePass, setShowRePass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [registerError, setRegisterError] = useState(null);

    const navigate = useNavigate();

    const onFinish = (data) => {
        setIsLoading(true);
        publicAxios
            .get(
                `${process.env.REACT_APP_BASE_URL}auth/register?clientId=${uuidv4()}&email=${
                    data.email
                }&username=${data.username}&password=${data.password}&displayName=${data.username}`
            )
            .then((response) => {
                console.log(response);
                setShowResultModal(true);
                setRegisterError(null);
                setIsLoading(false);
            })
            .catch((registerErr) => {
                setRegisterError(registerErr.response.data.error);
                setIsLoading(false);
            });
    };

    return (
        <>
            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
                <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
                    <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                        Sign up
                    </h1>
                    <Form
                        form={form}
                        name="register_form"
                        layout="vertical"
                        requiredMark="optional"
                        validateTrigger="onChange"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            className="text-sm font-medium text-gray-700 mb-3 pb-1"
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Email is required.",
                                    whitespace: true
                                },
                                {
                                    pattern:
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: "Invalid email."
                                }
                            ]}
                        >
                            <Input
                                id="email"
                                className="shadow-sm
                                focus:ring-purple-600 focus:border-purple-500
                                focus:shadow-purple-300 focus:shadow-md
                                hover:border-purple-400
                                block w-full sm:text-sm border-gray-300
                                px-2 py-2 bg-white border rounded-md "
                                type="email"
                                placeholder="john.doe@example.com"
                            />
                        </Form.Item>

                        <Form.Item
                            className="text-sm font-medium text-gray-700 mb-3 pb-1"
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Username is required.",
                                    whitespace: true
                                }
                            ]}
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
                            className="text-sm font-medium text-gray-700 mb-3 pb-1"
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Password is required."
                                },
                                {
                                    pattern:
                                        /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,}$/,
                                    message:
                                        "Password Must Contain Atleast 8 Characters with One Uppercase, One Lowercase, One Number and One Special Case Character."
                                }
                            ]}
                        >
                            <div className="relative">
                                <Input
                                    id="password"
                                    className="shadow-sm
                                        focus:ring-purple-600 focus:border-purple-500
                                        focus:shadow-purple-300 focus:shadow-md
                                        hover:border-purple-400
                                        block w-full sm:text-sm border-gray-300
                                        pl-2 pr-10  py-2 bg-white border rounded-md "
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

                        <Form.Item
                            className="text-sm font-medium text-gray-700 mb-3 pb-1"
                            label="Re-password"
                            name="re_password"
                            rules={[
                                {
                                    required: true,
                                    message: "Re-Password is required."
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Password and Re-Password must be the same.")
                                        );
                                    }
                                })
                            ]}
                        >
                            <div className="relative">
                                <Input
                                    id="re_password"
                                    className="shadow-sm
                                        focus:ring-purple-600 focus:border-purple-500
                                        focus:shadow-purple-300 focus:shadow-md
                                        hover:border-purple-400
                                        block w-full sm:text-sm border-gray-300
                                        pl-2 pr-10 py-2 bg-white border rounded-md "
                                    type={showRePass ? "text" : "password"}
                                    placeholder="********"
                                />
                                <div
                                    className="icon_button absolute right-4 top-2"
                                    onClick={() => {
                                        setShowRePass(!showRePass);
                                    }}
                                    aria-hidden="true"
                                >
                                    {showRePass ? (
                                        <FaEye className="w-5 h-5 text-purple-400" />
                                    ) : (
                                        <FaEyeSlash className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <>
                                <div className="py-3 text-right flex flex-row justify-between">
                                    <button
                                        type="submit"
                                        data-mdb-ripple="true"
                                        data-mdb-ripple-color="light"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent
                                    shadow-sm text-sm font-medium rounded-md text-white bg-purple-700
                                    hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                                    >
                                        {isLoading ? (
                                            <div className="flex justify-center items-center">
                                                <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                                                Creating account...
                                            </div>
                                        ) : (
                                            "Create account"
                                        )}
                                    </button>
                                    <div className="text-center text-gray-500 mt-2">
                                        <span>Already have an account?</span>&nbsp;
                                        <Link
                                            to="/login"
                                            className="no-underline hover:no-underline hover:text-purple-700 font-bold"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                </div>
                                <p className="text-red-600">{registerError}</p>
                            </>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <ModalFrame
                width="xl:w-1/4 md:w-2/6 sm:w-3/5"
                isVisible={showResultModal}
                onClose={() => {
                    navigate("/login");
                }}
            >
                <AuthResultModalBody
                    authStatus={1}
                    resultText="You have successfully created an account."
                    message="You need to verify your email to active this account before signing in with it."
                    onClose={() => {
                        navigate("/login");
                    }}
                />
            </ModalFrame>
        </>
    );
}

export default RegisterPage;
