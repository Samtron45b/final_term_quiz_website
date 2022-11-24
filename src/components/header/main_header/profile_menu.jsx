import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useState, useRef, useEffect } from "react";

function ProfileMenu() {
    const wrapperRef = useRef(null);
    const [isProfileMenuOpen, setIsProFileMenuOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsProFileMenuOpen(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className="user_avatar flex cursor-pointer rounded-full w-12 h-12 justify-center items-center space-x-2 hover:bg-gray-100"
                aria-hidden="true"
                onClick={() => setIsProFileMenuOpen(!isProfileMenuOpen)}
            >
                <img
                    className="w-5/6 h-5/6 rounded-full"
                    src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                    alt=""
                />
            </div>
            <div
                hidden={!isProfileMenuOpen}
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex="-1"
            >
                <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                >
                    <CgProfile className="mr-1 w-4 h-4" />
                    Your Profile
                </Link>

                <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                >
                    <MdLogout className="mr-1 w-4 h-4" />
                    Sign out
                </Link>
            </div>
        </div>
    );
}

export default ProfileMenu;
