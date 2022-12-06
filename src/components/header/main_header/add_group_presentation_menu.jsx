import { MdGroups } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { HiPresentationChartLine } from "react-icons/hi";
import { useState, useRef, useEffect, useContext } from "react";
import AddGroupModalContext from "../../contexts/add_group_context";

function AddGroupPresentationMenu() {
    const wrapperRef = useRef(null);
    const [isAddGroupPresentationMenuOpen, setIsAddGroupPresentationMenuOpen] = useState(false);
    const { setAddingType } = useContext(AddGroupModalContext);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsAddGroupPresentationMenuOpen(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    function renderText(text) {
        return `Create a ${text}`;
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className="plus_group_container cursor-pointer flex justify-center items-center w-12 h-12 rounded-full hover:bg-gray-100 "
                aria-hidden="true"
                onClick={() => setIsAddGroupPresentationMenuOpen(!isAddGroupPresentationMenuOpen)}
            >
                <IoMdAdd className="plus_group_icon w-8 h-8 " />
            </div>
            <div
                hidden={!isAddGroupPresentationMenuOpen}
                className="absolute right-0 z-50 mt-1.5 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="add-group-presentation-menu-button"
                tabIndex="-1"
            >
                <button
                    type="button"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="add-group-presentation-menu-item-1"
                    onClick={() => {
                        setIsAddGroupPresentationMenuOpen(false);
                        setAddingType(1);
                    }}
                >
                    <MdGroups className="mr-1 w-4 h-4" />
                    {renderText("group")}
                </button>
                <button
                    type="button"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="add-group-presentation-menu-item-2"
                    onClick={() => {
                        setIsAddGroupPresentationMenuOpen(false);
                        setAddingType(2);
                    }}
                >
                    <HiPresentationChartLine className="mr-1 w-4 h-4" />
                    {renderText("presentation")}
                </button>
            </div>
        </div>
    );
}

export default AddGroupPresentationMenu;
