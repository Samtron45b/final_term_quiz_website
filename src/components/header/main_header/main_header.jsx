import { Link } from "react-router-dom";
import { useState } from "react";
import ProfileMenu from "./profile_menu";
import AddGroupPresentationMenu from "./add_group_presentation_menu";
import ModalFrame from "../../modals/modal_frame";
import AddGroupPresentationModalBody from "../../modals/add_group_presentation_modal_body";

function MainHeader() {
    const [addingType, setAddingType] = useState(0);
    return (
        <>
            <header className="head_container flex self-center sticky top-0 z-30 w-full h-[10%] md:px-5 px-4 bg-white shadow-md">
                <div className="header_items flex items-center justify-between mx-auto w-full">
                    <Link to="/">
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
                        <AddGroupPresentationMenu setAddingType={setAddingType} />
                        <ProfileMenu />
                    </div>
                </div>
            </header>
            <ModalFrame
                width="40%"
                isVisible={addingType > 0}
                clickOutSideToClose={false}
                onClose={() => setAddingType(0)}
            >
                <AddGroupPresentationModalBody
                    addingType={addingType}
                    setShowModal={setAddingType}
                />
            </ModalFrame>
        </>
    );
}

export default MainHeader;
