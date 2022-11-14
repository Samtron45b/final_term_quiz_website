import React from "react";

function RegisterForm() {
    return (
        <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
            <form>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Email
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="john.doe@example.com"
                                className="shadow-sm focus:ring-indigo-500
                                        focus:border-indigo-500 mt-1
                                        block w-full sm:text-sm border border-gray-300 rounded-md"
                            />
                        </div>
                    </label>
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                        <div className="mt-1">
                            <input
                                type="text"
                                name="username"
                                placeholder="johndoe"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                                mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            />
                        </div>
                    </label>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                        <div className="mt-1">
                            <input
                                type="password"
                                name="password"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                                            mt-1 block w-full sm:text-sm border border-gray-300
                                            rounded-md"
                            />
                        </div>
                    </label>
                </div>
                <div>
                    <div className="py-3 bg-gray-50 text-right flex flex-row justify-between">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign up
                        </button>
                        <div className="text-center text-gray-500">
                            <span>Already have an account?</span>&nbsp;
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
