import PropTypes from "prop-types";
import { IoMdAdd } from "react-icons/io";
import { BsFillPlayFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { GiChoice } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import ActionBtnMenu from "./action_btns_menu";

function ActionButton({
    presentationId,
    presentationName,
    isOwner,
    parentAfterAddSlide,
    parentUpdateSavingStatus,
    onPresentBtnClick,
    onCollabBtnClick,
    onDeleteBtnClick
}) {
    const navigate = useNavigate();
    const privateAxios = usePrivateAxios();
    async function addSlide() {
        parentUpdateSavingStatus(true);
        privateAxios
            .get(`presentation/addSlide?presentationId=${presentationId}`)
            .then((response) => {
                parentAfterAddSlide(response?.data);
                return response;
            })
            .catch((error) => {
                console.log("get error");
                console.log(error);
            })
            .finally(() => {
                parentUpdateSavingStatus(false);
            });
    }

    function renderOtherBtnsBaseOnRole() {
        if (isOwner) {
            return (
                <>
                    <button
                        type="button"
                        onClick={() => onPresentBtnClick({ presentationId, presentationName })}
                        className="mr-3 bg-purple-500 flex justify-center items-center px-2 py-2 rounded-md text-white"
                    >
                        <BsFillPlayFill className="mr-1" />
                        Present
                    </button>
                    <ActionBtnMenu
                        presentationId={presentationId}
                        presentationName={presentationName}
                        onCollabBtnClick={onCollabBtnClick}
                        onDeleteBtnClick={onDeleteBtnClick}
                    />
                </>
            );
        }
        return (
            <>
                <button
                    type="button"
                    onClick={() => onCollabBtnClick()}
                    className="bg-purple-500 flex justify-center items-center mr-4 px-2 py-2 rounded-md text-white"
                >
                    <RiTeamFill className="mr-3" />
                    Collaborators
                </button>
                <button
                    type="button"
                    onClick={() => navigate(`../presentation/${presentationId}/result`)}
                    className="bg-purple-500 flex justify-center items-center mr-4 px-2 py-2 rounded-md text-white"
                >
                    <GiChoice className="mr-1" />
                    Present result
                </button>
            </>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => addSlide()}
                className="mr-3 bg-purple-500 flex justify-center items-center px-2 py-2 rounded-md text-white"
            >
                <IoMdAdd className="mr-1" />
                New slide
            </button>
            {renderOtherBtnsBaseOnRole()}
        </>
    );
}

ActionButton.propTypes = {
    presentationId: PropTypes.number,
    presentationName: PropTypes.string,
    isOwner: PropTypes.bool,
    parentAfterAddSlide: PropTypes.func,
    parentUpdateSavingStatus: PropTypes.func,
    onPresentBtnClick: PropTypes.func,
    onCollabBtnClick: PropTypes.func,
    onDeleteBtnClick: PropTypes.func
};

ActionButton.defaultProps = {
    presentationId: 0,
    presentationName: "",
    isOwner: false,
    parentAfterAddSlide: null,
    parentUpdateSavingStatus: null,
    onPresentBtnClick: null,
    onCollabBtnClick: null,
    onDeleteBtnClick: null
};

export default ActionButton;
