import PropTypes from "prop-types";
import { BiGridVertical } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function PresentationSingleSlideThumbNail({
    isSelected,
    canBeDeleted,
    onClick,
    id,
    index,
    icon,
    question,
    updateListSlide,
    updateSavingStatus,
    updateObjectToRemove
}) {
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const wrapperRef = useRef(null);

    const privateAxios = usePrivateAxios();

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDeleteMenu(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    async function deleteSlide() {
        updateSavingStatus(true);
        updateListSlide(id);
        privateAxios
            .get(`presentation/deleteSlide?slideId=${id}`)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            })
            .finally(() => updateSavingStatus(false));
    }

    return (
        <div
            key={id}
            className={`flex flex-row pr-3 py-2 h-[17%] cursor-pointer ${
                isSelected ? "bg-purple-400" : "bg-transparent"
            }`}
            aria-hidden="true"
            onClick={() => onClick()}
        >
            <div
                className={`w-2 h-5/6 mr-2 self-center ${
                    isSelected ? "bg-purple-600" : "bg-transparent"
                }`}
            />
            <div ref={wrapperRef} className="flex-col flex relative justify-between pb-2">
                <p className="text-gray-500 mr-4">{index + 1}</p>
                <BiGridVertical
                    className="text-gray-300 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteMenu(!showDeleteMenu);
                    }}
                />
                <div
                    hidden={!showDeleteMenu}
                    className="absolute left-0 bottom-0 translate-y-[2.8rem] z-50 mt-1.5 w-44 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="add-group-presentation-menu-button"
                    tabIndex="-1"
                >
                    <button
                        type="button"
                        className={`flex items-center px-2 py-3 text-sm ${
                            canBeDeleted ? "text-red-500" : "text-red-300"
                        }`}
                        role="menuitem"
                        tabIndex="-1"
                        id="add-group-presentation-menu-item-1"
                        onClick={(e) => {
                            if (!canBeDeleted) return;
                            e.stopPropagation();
                            updateObjectToRemove({
                                name: "this slide",
                                onConfirmRemove: async () => deleteSlide()
                            });
                            setShowDeleteMenu(false);
                        }}
                    >
                        <FiTrash2 className="mr-1 w-4 h-4" />
                        {canBeDeleted ? "Delete" : "Cannot remove"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col overflow-hidden justify-center items-center w-full bg-white border border-black rounded-lg">
                {icon}
                <p className="w-full px-1 text-gray-400 text-center text-ellipsis overflow-hidden whitespace-nowrap">
                    {question}
                </p>
            </div>
        </div>
    );
}

PresentationSingleSlideThumbNail.propTypes = {
    id: PropTypes.number,
    index: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    icon: PropTypes.any,
    question: PropTypes.string,
    isSelected: PropTypes.bool,
    canBeDeleted: PropTypes.bool,
    onClick: PropTypes.func,
    updateListSlide: PropTypes.func,
    updateSavingStatus: PropTypes.func,
    updateObjectToRemove: PropTypes.func
};

PresentationSingleSlideThumbNail.defaultProps = {
    id: 0,
    index: 0,
    icon: null,
    question: "",
    isSelected: false,
    canBeDeleted: true,
    onClick: null,
    updateListSlide: null,
    updateSavingStatus: null,
    updateObjectToRemove: null
};

export default PresentationSingleSlideThumbNail;
