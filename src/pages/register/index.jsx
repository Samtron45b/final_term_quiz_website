import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner10 } from "react-icons/im";
import axios from "axios";
import ModalFrame from "../../components/modals/modal_frame";
import AuthResultModalBody from "../../components/modals/auth_result_modal_body";

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm({
        mode: "onChange"
    });

    const [showPass, setShowPass] = useState(false);
    const [showRePass, setShowRePass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [registerError, setRegisterError] = useState(null);

    const navigate = useNavigate();

    const onSubmit = (data) => {
        setIsLoading(true);
        axios
            .get(
                `https://45d6-2402-800-63b6-df31-61e7-55fc-79cc-bfa1.ap.ngrok.io/user/register?clientId=123&email=${data.email}&username=${data.username}&password=${data.password}`
            )
            .then((response) => {
                console.log(response);
                setShowResultModal(true);
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="email-input mb-3">
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="john.doe@example.com"
                                    className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                            message: "Invalid email"
                                        }
                                    })}
                                />
                                <p className="text-red-600">{errors.email?.message}</p>
                            </label>
                        </div>
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
                                    {...register("username", { required: "Username is required." })}
                                />
                                <p className="text-red-600">{errors.username?.message}</p>
                            </label>
                        </div>
                        <div className="mb-3">
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
                                            message:
                                                "Password Must Contain Atleast 8 Characters with One Uppercase, One Lowercase, One Number and One Special Case Character"
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
                                <p className="text-red-600">{errors.password?.message}</p>
                            </label>
                        </div>
                        <div className="mb-3">
                            <label
                                className="block text-sm font-medium text-gray-700 relative"
                                htmlFor="re_password"
                            >
                                Re-Password
                                <input
                                    type={showRePass ? "text" : "password"}
                                    name="re_password"
                                    className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                                    id="re_password"
                                    placeholder="********"
                                    {...register("re_password", {
                                        required: "true",
                                        minLength: 8,
                                        validate: (value) => value === getValues("password")
                                    })}
                                />
                                <div
                                    className="icon_button absolute right-4 top-8"
                                    onClick={() => {
                                        setShowRePass(!showRePass);
                                    }}
                                    aria-hidden="true"
                                >
                                    {showRePass ? (
                                        <FaEye className="w-5 h-5" />
                                    ) : (
                                        <FaEyeSlash className="w-5 h-5" />
                                    )}
                                </div>
                                {errors.re_password && errors.re_password.type === "required" && (
                                    <span className="text-red-600" role="alert">
                                        Repassword is required
                                    </span>
                                )}
                                {errors.re_password && errors.re_password.type === "minLength" && (
                                    <span className="text-red-600" role="alert">
                                        Minimum length is 8
                                    </span>
                                )}
                                {errors.re_password && errors.re_password.type === "validate" && (
                                    <span className="text-red-600" role="alert">
                                        Password and Re-Password must be the same
                                    </span>
                                )}
                            </label>
                        </div>
                        <div>
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
                        </div>
                        <p className="text-red-600">{registerError}</p>
                    </form>
                </div>
            </div>
            <ModalFrame
                width="20%"
                isVisible={showResultModal}
                onClose={() => {
                    navigate("/login");
                }}
            >
                <AuthResultModalBody
                    authStatus={1}
                    message="Please verify your email to active this account before signing in with it."
                    onClose={() => {
                        navigate("/login");
                    }}
                />
            </ModalFrame>
        </>
    );
}

export default RegisterPage;
