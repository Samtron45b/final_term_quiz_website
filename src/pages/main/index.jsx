import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import MainHeader from "../../components/header/main_header/main_header";

function Main() {
    const getQuotes = async () => {
        const res = await fetch("https://api.quotable.io/random");
        return res.json();
    };

    const { data, error, isLoading } = useQuery("randomQuotes", getQuotes, {
        refetchInterval: 6000
    });

    if (error) return <div>Request Failed</div>;
    if (isLoading) return <div>Loading...</div>;
    // Show the response if everything is fine
    return (
        <div>
            <MainHeader />
            <h1>Random Quotes:</h1>
            <p>{data.content}</p>
            <div className="flex space-x-4 text-gray-500 mt-2">
                <Link
                    to="/login"
                    class="no-underline hover:no-underline hover:text-blue-800 font-bold"
                >
                    <div className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                        Sign in
                    </div>
                </Link>

                <Link
                    to="/register"
                    class="no-underline hover:no-underline hover:text-blue-800 font-bold"
                >
                    <div className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-teal-700 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600">
                        Register
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Main;
