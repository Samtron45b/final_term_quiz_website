import PropTypes from "prop-types";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdAssignmentInd } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import AuthContext from "../contexts/auth_context";

function MemberGroupCard({
    groupName,
    memberName,
    memberAvatar,
    memberRole,
    memberDisplayName,
    userRole,
    isLastRow,
    onChangeRoleBtnClick,
    onRemoveBtnClick
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const privateAxios = usePrivateAxios();

    async function onDeleteUser() {
        return privateAxios
            .get(`group/kickUser?groupname=${groupName}&username=${memberName}`)
            .then((response) => {
                console.log(response);
                const currentLocation = location.pathname;
                navigate("/temp");
                setTimeout(() => {
                    navigate(`/${currentLocation}`, { replace: true });
                }, 100);
            });
    }

    function renderButton(btnType) {
        let btnDisabled;
        if (btnType === 1) {
            btnDisabled = false;
        } else {
            btnDisabled =
                btnType === 2
                    ? userRole > 2 || userRole >= memberRole
                    : userRole > 3 || userRole >= memberRole;
        }
        let btnIconActiveColor;
        if (btnType === 1) {
            btnIconActiveColor = "text-neutral-500";
        } else if (btnType === 2) {
            btnIconActiveColor = "text-cyan-400";
        } else {
            btnIconActiveColor = "text-red-500";
        }
        // const roleBtnDisabled = userRole > 3;
        // const deleteBtnDisabled = userRole > 4;
        // const roleIconColor = `text-${roleBtnDisabled ? "transparent" : "cyan-400"}`;
        // const deleteIconColor = `text-${deleteBtnDisabled ? "transparent" : "red-500"}`;
        const bgHoverColor = "bg-gray-100";
        const className = `rounded-full p-3 hover:${
            btnDisabled ? "bg-transparent" : bgHoverColor
        } cursor-${btnDisabled ? "default" : "pointer"}`;
        const iconColor = `${btnDisabled ? "text-transparent" : btnIconActiveColor}`;
        let icon;
        if (btnType === 1) {
            icon = <ImProfile size={20} className={iconColor} />;
        } else if (btnType === 2) {
            icon = <MdAssignmentInd size={20} className={iconColor} />;
        } else {
            icon = <AiOutlineUserDelete size={20} className={iconColor} />;
        }

        return (
            <button
                disabled={btnDisabled}
                hidden={btnDisabled}
                type="button"
                className={className}
                onClick={() => {
                    if (btnType === 1) {
                        console.log("btnType = 1");
                        if (user.username === memberName) {
                            navigate(`/account/${user.username}`);
                        }
                    } else if (btnType === 2) {
                        onChangeRoleBtnClick({
                            name: memberName,
                            role: memberRole,
                            displayName: memberDisplayName
                        });
                    } else {
                        onRemoveBtnClick({
                            name: `member ${memberDisplayName} from group ${groupName}`,
                            onConfirmRemove: async () => onDeleteUser()
                        });
                        onDeleteUser({ name: memberName, role: memberRole });
                    }
                }}
            >
                {icon}
            </button>
        );
    }

    return (
        <tr className={`${isLastRow ? "" : "border-b"}`}>
            <td className="py-2 w-[95%]">
                <div className="flex items-center">
                    <img className="w-8 h-8 rounded-full mr-4 bg-black" src={memberAvatar} alt="" />
                    <p className="text-lg text-gray-700 truncate">{`${memberDisplayName} ${
                        memberRole === 2 ? "(Co-owner)" : ""
                    }`}</p>
                </div>
            </td>
            <td className=" py-2">
                <div className="flex items-center">
                    {renderButton(1)}
                    {renderButton(2)}
                    {renderButton(3)}
                    {/* <div className="rounded-full hover:bg-neutral-400 p-3">
                        <AiOutlineUserDelete size={12} className="text-cyan-400" />
                    </div>
                    <div className="rounded-full hover:bg-neutral-400 p-3">
                        <MdAssignmentInd size={12} className="text-red-500" />
                    </div> */}
                </div>
            </td>
        </tr>
    );
}

MemberGroupCard.propTypes = {
    groupName: PropTypes.string.isRequired,
    memberName: PropTypes.string.isRequired,
    memberAvatar: PropTypes.string.isRequired,
    memberRole: PropTypes.number.isRequired,
    memberDisplayName: PropTypes.string.isRequired,
    userRole: PropTypes.number.isRequired,
    isLastRow: PropTypes.bool.isRequired,
    onChangeRoleBtnClick: PropTypes.func,
    onRemoveBtnClick: PropTypes.func
};
MemberGroupCard.defaultProps = {
    onChangeRoleBtnClick: null,
    onRemoveBtnClick: null
};

export default MemberGroupCard;
