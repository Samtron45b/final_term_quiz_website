import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import ProfileMenu from "./profile_menu";

function MainHeader() {
    return (
        <header className="head_container sticky top-0 z-30 w-full md:p-5 px-4 py-5 bg-white shadow-xl">
            <div className="header_items flex items-center justify-between mx-auto w-full">
                <Link href="/">
                    <span className="header_item_left text-2xl font-extrabold text-gray-500 hover:text-purple-700">
                        Let&#39;s play
                    </span>
                </Link>
                {/* <div className="flex items-center space-x-1">
                    <ul className="hidden space-x-2 md:inline-flex">
                        <li>
                            <Link
                                href="/"
                                className="px-4 py-2 font-semibold text-gray-600 rounded"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="px-4 py-2 font-semibold text-gray-600 rounded"
                            >
                                Blogs
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="px-4 py-2 font-semibold text-gray-600 rounded"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="px-4 py-2 font-semibold text-gray-600 rounded"
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div> */}
                <div className="header_item_right flex items-center space-x-3">
                    <style>
                        {`
                            .plus_group_container:hover .plus_group_icon{
                                fill: #6b46c1;
                            }
                        `}
                    </style>
                    <div className="plus_group_container cursor-pointer flex justify-center items-center w-12 h-12 rounded-full hover:bg-gray-100 ">
                        <IoMdAdd className="plus_group_icon w-8 h-8 " />
                    </div>
                    <ProfileMenu />
                </div>
            </div>
        </header>
    );
}

export default MainHeader;
