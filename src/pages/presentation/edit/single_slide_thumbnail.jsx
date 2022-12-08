import PropTypes from "prop-types";
import { RiBarChart2Fill } from "react-icons/ri";
import { BiGridVertical } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function PresentationSingleSlideThumbNail({
    isSelected,
    onClick,
    id,
    index,
    question,
    updateListSlide
}) {
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const wrapperRef = useRef(null);

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
        const token = localStorage.getItem("accessToken");
        axios
            .get(`${process.env.REACT_APP_BASE_URL}presentation/deleteSlide?slideId=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response);
                updateListSlide(id);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            });
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
                        className="flex items-center px-2 py-3 text-sm text-red-500"
                        role="menuitem"
                        tabIndex="-1"
                        id="add-group-presentation-menu-item-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteSlide();
                            setShowDeleteMenu(false);
                        }}
                    >
                        <FiTrash2 className="mr-1 w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full bg-white border border-black rounded-lg">
                <RiBarChart2Fill size={50} className="text-gray-400" />
                <p className="text-gray-400 text-center">{question}</p>
            </div>
        </div>
    );
}

PresentationSingleSlideThumbNail.propTypes = {
    id: PropTypes.string,
    index: PropTypes.number,
    question: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    updateListSlide: PropTypes.func
};

PresentationSingleSlideThumbNail.defaultProps = {
    id: "",
    index: 0,
    question: "",
    isSelected: false,
    onClick: null,
    updateListSlide: null
};

export default PresentationSingleSlideThumbNail;
