import { RxDotsHorizontal } from "react-icons/rx";
import { MdCancelPresentation } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import PropsType from "prop-types";
import { useNavigate } from "react-router-dom";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function ActionBtnMenu({ presentationId, presentationName, onCollabBtnClick, onDeleteBtnClick }) {
    const wrapperRef = useRef(null);
    const [isActionBtnsMenuOpen, setIsActionBtnsMenuOpen] = useState(false);

    const privateAxios = usePrivateAxios();
    const navigate = useNavigate();

    async function onDeletePresentation() {
        return privateAxios
            .get(`presentation/delete?presentationId=${presentationId}`)
            .then((response) => {
                console.log(response);
                navigate(-1);
            });
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsActionBtnsMenuOpen(false);
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
                className="action_btns_menu_container cursor-pointer flex justify-center items-center w-12 h-12 rounded-full hover:bg-gray-100 "
                aria-hidden="true"
                onClick={() => setIsActionBtnsMenuOpen(!isActionBtnsMenuOpen)}
            >
                <RxDotsHorizontal size={24} className="action_btns_menu_icon text-purple-500" />
            </div>
            <div
                hidden={!isActionBtnsMenuOpen}
                className="absolute right-0 z-50 mt-1.5 w-52 py-1 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                    id="action-btns-menu-item-1"
                    onClick={() => {
                        setIsActionBtnsMenuOpen(false);
                        onCollabBtnClick(true);
                    }}
                >
                    <RiTeamFill className="mr-1 w-4 h-4" />
                    Collaborators
                </button>
                <button
                    type="button"
                    className="flex items-center px-4 py-2 text-sm text-red-600"
                    role="menuitem"
                    tabIndex="-1"
                    id="action-btns-menu-item-2"
                    onClick={() => {
                        setIsActionBtnsMenuOpen(false);
                        onDeleteBtnClick({
                            name: `presentation ${presentationName}`,
                            onConfirmRemove: async () => onDeletePresentation()
                        });
                    }}
                >
                    <MdCancelPresentation className="mt-[2px] mr-1 w-4 h-4" />
                    Delete this presentation
                </button>
            </div>
        </div>
    );
}

ActionBtnMenu.propTypes = {
    presentationId: PropsType.number,
    presentationName: PropsType.string,
    onCollabBtnClick: PropsType.func,
    onDeleteBtnClick: PropsType.func
};

ActionBtnMenu.defaultProps = {
    presentationId: 0,
    presentationName: "",
    onCollabBtnClick: null,
    onDeleteBtnClick: null
};

export default ActionBtnMenu;
