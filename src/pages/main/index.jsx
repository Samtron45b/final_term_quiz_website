import React from "react";
import { useQuery } from "react-query";

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
            <h1>Random Quotes:</h1>
            <p>{data.content}</p>
        </div>
    );
}

export default Main;
