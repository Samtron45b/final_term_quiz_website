/* eslint-disable no-undef */
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import jwtDecode from "jwt-decode";
import AuthContext from "../../components/contexts/auth_context";

const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleGoogle = async (response) => {
        setLoading(true);

        axios(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: { credential: response.credential, clientId: uuidv4() }
        })
            .then((res) => {
                const { accessToken } = res.data;
                localStorage.setItem("accessToken", accessToken);
                const decode = jwtDecode(accessToken, "letsplay");
                setUser({
                    displayName: decode.displayName,
                    username: decode.name,
                    avatar: decode.avatar
                        ? decode.avatar
                        : "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
                    email: decode.email
                });
                const userData = {
                    displayName: decode.displayName,
                    username: decode.name,
                    avatar: decode.avatar
                        ? decode.avatar
                        : "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
                    email: decode.email
                };
                localStorage.setItem("userData", JSON.stringify(userData));
                navigate("/", { replace: true });
                setError(null);
                setLoading(false);
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
            google.accounts.id.renderButton(document.getElementById("googleBtn"), {
                type: "icon",
                shape: "circle",
                theme: "outline"
            });
        }
    }, [handleGoogle]);

    return (
        <div className="flex justify-center mt-4 gap-x-2">
            <button
                type="button"
                className="text-white bg-[#1877f2] font-medium rounded-full text-sm px-[18px] text-center inline-flex items-center mr-2 mb-2"
            >
                <FaFacebookF className="w-7 h-7" />
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
