import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };
    const [showPass, setShowPass] = useState(false);

    const [showRePass, setShowRePass] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                    Sign up
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="email-input mb-3">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="john.doe@example.com"
                                className="shadow-sm
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-full sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                                {...register("email", { required: true })}
                            />
                            {errors.email && (
                                <span className="text-red-600">This field is required</span>
                            )}
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
                    <div className="mb-3">
                        <label
                            className="block text-sm font-medium text-gray-700 relative"
                            htmlFor="password"
                        >
                            Re-Password
                            <input
                                type={showRePass ? "text" : "password"}
                                name="re_password"
                                className="shadow-sm
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-full sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                                id="password"
                                placeholder="********"
                                {...register("re_password", { required: true }, { minLength: 8 })}
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
                            {errors.re_password && (
                                <span className="text-red-600">This field is required</span>
                            )}
                        </label>
                    </div>
                    <div>
                        <div className="py-3 text-right flex flex-row justify-between">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent
                                shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600
                                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-indigo-500"
                            >
                                Create account
                            </button>
                            <div className="text-center text-gray-500 mt-2">
                                <span>Already have an account?</span>&nbsp;
                                <Link
                                    to="/login"
                                    class="no-underline hover:no-underline hover:text-blue-800 font-bold"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
