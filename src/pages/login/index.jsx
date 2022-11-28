import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner10 } from "react-icons/im";
import SocialSignInBtns from "./socialSignInBtns";
import AuthResultModal from "../../components/modals/auth_result_modal_body";
import ModalFrame from "../../components/modals/modal_frame";

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => console.log(data);
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    return (
        <>
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
                                    block w-full sm:text-sm border border-gray-300 rounded-md
                                    px-2 py-2 bg-white border rounded-md "
                                    id="username"
                                    type="text"
                                    placeholder="Quamon"
                                    {...register("username", { required: true })}
                                />
                                {errors.username && (
                                    <span className="text-red-600">This field is required</span>
                                )}
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
                                    block w-full sm:text-sm border border-gray-300 rounded-md
                                    px-2 py-2 bg-white border rounded-md "
                                    id="password"
                                    placeholder="********"
                                    {...register("password", { required: true }, { minLength: 8 })}
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
                                {errors.password && (
                                    <span className="text-red-600">This field is required</span>
                                )}
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
                                onClick={() => setIsLoading(true)}
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
            <ModalFrame isVisible={showResultModal} onClose={() => setShowResultModal(false)}>
                <AuthResultModal
                    authStatus={1}
                    message="Succeeded."
                    onClose={() => setShowResultModal(false)}
                />
            </ModalFrame>
        </>
    );
}

export default LoginPage;
