import axios from "axios";
import PropTypes from "prop-types";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdAssignmentInd } from "react-icons/md";

function MemberGroupCard({
    presentationName,
    presentationId,
    memberAvatar,
    memberRole,
    ownerDisplayName,
    userRole,
    isLastRow,
    onChangeRoleBtnClick,
    onRemoveBtnClick
}) {
    function onDeleteUser() {
        const token = localStorage.getItem("accessToken");
        axios
            .get(
                `${process.env.REACT_APP_BASE_URL}group/kickUser?presentationName=${presentationName}username=${presentationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function renderButton(btnType) {
        const isRoleBtn = btnType.toLocaleLowerCase() === "role".toLocaleLowerCase();
        const btnDisabled = isRoleBtn
            ? userRole > 2 || userRole >= memberRole
            : userRole > 3 || userRole >= memberRole;
        const btnIconActiveColor = `text-${isRoleBtn ? "cyan-400" : "red-500"}`;
        // const roleBtnDisabled = userRole > 3;
        // const deleteBtnDisabled = userRole > 4;
        // const roleIconColor = `text-${roleBtnDisabled ? "transparent" : "cyan-400"}`;
        // const deleteIconColor = `text-${deleteBtnDisabled ? "transparent" : "red-500"}`;
        const bgHoverColor = "bg-gray-100";
        const className = `rounded-full p-3 hover:${
            btnDisabled ? "bg-transparent" : bgHoverColor
        } cursor-${btnDisabled ? "default" : "pointer"}`;
        const iconColor = `${btnDisabled ? "text-transparent" : btnIconActiveColor}`;
        return (
            <button
                disabled={btnDisabled}
                type="button"
                className={className}
                onClick={() => {
                    if (isRoleBtn) {
                        onChangeRoleBtnClick({
                            name: presentationId,
                            role: memberRole,
                            displayName: ownerDisplayName
                        });
                    } else {
                        onRemoveBtnClick({
                            displayname: ownerDisplayName,
                            isGroupMember: true
                        });
                        onDeleteUser({ name: presentationId, role: memberRole });
                    }
                }}
            >
                {isRoleBtn ? (
                    <MdAssignmentInd size={20} className={iconColor} />
                ) : (
                    <AiOutlineUserDelete size={20} className={iconColor} />
                )}
            </button>
        );
    }

    return (
        <tr className={`flex items-center py-2 ${isLastRow ? "" : "border-b"}`}>
            <td className="w-[87%]">
                <div className="flex items-center">
                    <img className="w-8 h-8 rounded-full mr-4 bg-black" src={memberAvatar} alt="" />
                    <p className="text-lg text-gray-700 truncate">{`${ownerDisplayName} ${
                        memberRole === 2 ? "(Co-owner)" : ""
                    }`}</p>
                </div>
            </td>
            <td className="">
                <div className="flex items-center">
                    {renderButton("role")}
                    {renderButton("delete")}
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
    presentationName: PropTypes.string.isRequired,
    presentationId: PropTypes.string.isRequired,
    memberAvatar: PropTypes.string.isRequired,
    memberRole: PropTypes.number.isRequired,
    ownerDisplayName: PropTypes.string.isRequired,
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