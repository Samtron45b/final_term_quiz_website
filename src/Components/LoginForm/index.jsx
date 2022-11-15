import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import SocialSignInBtns from "./socialSignInBtns";

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => console.log(data);

    return (
        <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                        Username
                        <input
                            name="username"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                        block w-full sm:text-sm border border-gray-300 rounded-md"
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
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                        Password
                        <input
                            type="password"
                            name="password"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                        block w-full sm:text-sm border border-gray-300 rounded-md"
                            id="password"
                            placeholder="********"
                            {...register("password", { required: true }, { minLength: 8 })}
                        />
                        {errors.password && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                <div className="py-3 bg-gray-50 text-right flex flex-row justify-between">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent
                                    shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600
                                    hover:bg-indigo-700 focus:outline-none focus:ring-2
                                    focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in
                    </button>
                    <div className="text-center text-gray-500">
                        <span>New to site?</span>&nbsp;
                        <Link
                            to="/register"
                            className="underline hover:underline hover:text-blue-800"
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
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
