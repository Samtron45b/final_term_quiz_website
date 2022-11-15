import React from "react";

function SocialSignInBtns() {
    return (
        <div className="flex justify-center mt-4 gap-x-2">
            <button
                type="button"
                className="text-white bg-[#3b5998] font-medium rounded-lg text-sm px-3.5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
                style={{ "background-color": "#1877f2" }}
            >
                <svg
                    className="mr-2 -ml-1 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="facebook-f"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                >
                    <path
                        fill="currentColor"
                        d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
                    />
                </svg>
                Facebook
            </button>
            <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="text-white font-medium rounded-lg text-sm pl-5 pr-3.5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
                style={{ "background-color": "#ea4335" }}
            >
                <svg
                    className="mr-2 -ml-1 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                >
                    <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    />
                </svg>
                Google
            </button>
        </div>
    );
}

export default SocialSignInBtns;
