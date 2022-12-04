/* eslint-disable no-undef */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogle = async (response) => {
        setLoading(true);

        axios(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: { credential: response.credential }
        })
            .then((res) => {
                setLoading(false);
                return res.json();
            })
            .then((data) => {
                if (data?.user) {
                    localStorage.setItem("user", JSON.stringify(data?.user));
                    // window.location.reload();
                }
                throw new Error(data?.message || data);
            })
            .catch((dataError) => {
                setError(dataError?.message);
            });
    };
    return { loading, error, handleGoogle };
};

function SocialSignInBtns() {
    const { handleGoogle, loading, error } = useFetch("http://localhost:5000/auth/login/google");

    useEffect(() => {
        if (window.google) {
            google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleGoogle
            });
            google.accounts.id.renderButton(document.getElementById("googleBtn"), {});
        }
    }, [handleGoogle]);

    return (
        <div className="flex justify-center mt-4 gap-x-2">
            <button
                type="button"
                className="text-white bg-[#3b5998] font-medium rounded-full text-sm p-3 text-center inline-flex items-center mr-2 mb-2"
                style={{ backgroundColor: "#1877f2" }}
            >
                <FaFacebookF className="w-5 h-5" />
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ? (
                <div>Loading....</div>
            ) : (
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="text-white bg-[#ea4335] font-medium rounded-full text-sm p-3 text-center inline-flex items-center mr-2 mb-2 "
                    id="googleBtn"
                >
                    <FaGoogle className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}

export default SocialSignInBtns;
