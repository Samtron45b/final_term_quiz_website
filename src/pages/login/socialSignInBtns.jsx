import React from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

function SocialSignInBtns() {
    return (
        <div className="flex justify-center mt-4 gap-x-2">
            <button
                type="button"
                className="text-white bg-[#3b5998] font-medium rounded-full text-sm p-3 text-center inline-flex items-center mr-2 mb-2"
                style={{ "background-color": "#1877f2" }}
            >
                <FaFacebookF className="w-5 h-5" />
            </button>
            <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="text-white bg-[#ea4335] font-medium rounded-full text-sm p-3 text-center inline-flex items-center mr-2 mb-2"
            >
                <FaGoogle className="w-5 h-5" />
            </button>
        </div>
    );
}

export default SocialSignInBtns;
