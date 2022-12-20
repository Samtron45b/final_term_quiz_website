import PropTypes from "prop-types";
import { AiOutlineLogin } from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";
import { RiEdit2Line, RiDeleteBin5Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { convertTimeStampToDate } from "../../utilities";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function PresentationCard({
    presentationName,
    presentationId,
    timeCreated,
    userCanEdit,
    // onChangeRoleBtnClick,
    onRemoveBtnClick
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const privateAxios = usePrivateAxios();
    async function onDeletePresentation() {
        return privateAxios
            .get(`presentation/delete?presentationId=${presentationId}`)
            .then((response) => {
                console.log(response);
                if (location.pathname === "/") {
                    navigate("/temp");
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 100);
                }
            });
    }

    function renderButton(btnType) {
        const isJoinBtn = btnType.toLocaleLowerCase() === "join".toLocaleLowerCase();
        if ((userCanEdit && isJoinBtn) || (!userCanEdit && !isJoinBtn)) return null;

        const isDeleteBtn = btnType.toLocaleLowerCase() === "delete".toLocaleLowerCase();
        const btnIconColor = `${isDeleteBtn ? "text-red-500" : "text-neutral-400"}`;
        const size = 24;

        function renderIcon() {
            let icon = null;
            switch (btnType.toLocaleLowerCase()) {
                case "join".toLocaleLowerCase(): {
                    icon = <AiOutlineLogin size={size} className={btnIconColor} />;
                    break;
                }
                case "edit".toLocaleLowerCase(): {
                    icon = <RiEdit2Line size={size} className={btnIconColor} />;
                    break;
                }
                case "delete".toLocaleLowerCase(): {
                    icon = <RiDeleteBin5Fill size={size} className={btnIconColor} />;
                    break;
                }
                default:
                    icon = <BsFillPlayFill size={size} className={btnIconColor} />;
                    break;
            }
            return icon;
        }

        return (
            <button
                type="button"
                className="rounded-full p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                    if (btnType.toLocaleLowerCase() === "delete".toLocaleLowerCase()) {
                        onRemoveBtnClick({
                            name: `presentation ${presentationName}`,
                            onConfirmRemove: async () => onDeletePresentation()
                        });
                    } else if (btnType.toLocaleLowerCase() === "edit".toLocaleLowerCase()) {
                        navigate(`/presentation/${presentationId}/edit`);
                    }
                }}
            >
                {renderIcon()}
            </button>
        );
    }

    return (
        <tr>
            <td className="py-2 px-6 text-lg text-gray-500 break-words">{presentationName}</td>
            <td className="py-2 px-6 text-lg text-gray-500 break-words">
                {convertTimeStampToDate({ date: new Date(timeCreated), showTime: true })}
            </td>
            <td className="py-2 px-6 flex items-center">
                {renderButton("join")}
                {renderButton("present")}
                {renderButton("edit")}
                {renderButton("delete")}
            </td>
        </tr>
    );
}

PresentationCard.propTypes = {
    presentationName: PropTypes.string,
    presentationId: PropTypes.string,
    timeCreated: PropTypes.number,
    userCanEdit: PropTypes.bool,
    // onChangeRoleBtnClick: PropTypes.func,
    onRemoveBtnClick: PropTypes.func
};
PresentationCard.defaultProps = {
    presentationName: "",
    presentationId: "",
    timeCreated: 0,
    userCanEdit: true,
    // onChangeRoleBtnClick: null,
    onRemoveBtnClick: null
};

export default PresentationCard;
