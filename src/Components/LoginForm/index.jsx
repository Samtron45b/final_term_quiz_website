import React from "react";
import { Link } from "react-router-dom";
import SocialSignInBtns from "./socialSignInBtns";

function LoginForm() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase">
                    Sign in
                </h1>
                <form>
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
                                required
                            />
                        </label>
                    </div>
                    <div className="password-input mb-3">
                        <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="password"
                        >
                            Password
                            <input
                                type="password"
                                name="password"
                                className="shadow-sm 
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-full sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                                id="password"
                                placeholder="********"
                                required
                                minLength="4"
                            />
                        </label>
                    </div>
                    <div className="forgot-pwd-btn mb-2">
                        <Link
                            to="/register"
                            class=" text-sm text-gray-500 no-underline hover:underline hover:text-blue-800"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            Login
                        </button>
                    </div>
                    <div className="mt-3 text-gray-500 text-center">
                        <span>Don&#39;t have account?</span>&nbsp;
                        <Link
                            to="/register"
                            class="no-underline hover:no-underline hover:text-blue-800 font-bold"
                        >
                            Register
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

export default LoginForm;
