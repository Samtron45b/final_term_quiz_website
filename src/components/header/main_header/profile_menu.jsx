import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../contexts/auth_context";
import LocationContext from "../../contexts/location_context";

function ProfileMenu() {
    const wrapperRef = useRef(null);
    const { user } = useContext(AuthContext);
    const { setLocation } = useContext(LocationContext);
    const [isProfileMenuOpen, setIsProFileMenuOpen] = useState(false);

    const navigate = useNavigate();

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

    async function signout() {
        axios
            .get(`${process.env.REACT_APP_BASE_URL}user/logout?clientId=123`)
            .then(() => {
                localStorage.removeItem("accessToken");
                setLocation(null);
                navigate("/login", { replace: true });
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className="user_avatar flex cursor-pointer rounded-full w-12 h-12 justify-center items-center space-x-2 hover:bg-gray-100"
                aria-hidden="true"
                onClick={() => setIsProFileMenuOpen(!isProfileMenuOpen)}
            >
                <img className="w-5/6 h-5/6 rounded-full" src={user.avatar} alt="" />
            </div>
            <div
                hidden={!isProfileMenuOpen}
                className="absolute right-0 z-50 mt-1.5 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex="-1"
            >
                <Link
                    to={`/account/${user.username}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                >
                    <CgProfile className="mr-1 w-4 h-4" />
                    My account
                </Link>

                <button
                    type="button"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                    onClick={signout}
                >
                    <MdLogout className="mr-1 w-4 h-4" />
                    Sign out
                </button>
            </div>
        </div>
    );
}

export default ProfileMenu;
