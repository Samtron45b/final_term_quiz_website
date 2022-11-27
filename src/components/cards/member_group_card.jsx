import PropTypes from "prop-types";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdAssignmentInd } from "react-icons/md";

function MemberGroupCard({ memberName, memberAvatar, memberRole, userRole, isLastRow }) {
    console.log(memberRole, userRole);

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
        return (
            <button
                disabled={isRoleBtn}
                type="button"
                className={`rounded-full p-3 hover:${
                    btnDisabled ? "bg-transparent" : bgHoverColor
                } cursor-${btnDisabled ? "default" : "pointer"}`}
            >
                {isRoleBtn ? (
                    <MdAssignmentInd
                        size={20}
                        className={`${btnDisabled ? "text-transparent" : btnIconActiveColor}`}
                    />
                ) : (
                    <AiOutlineUserDelete
                        size={20}
                        className={`${btnDisabled ? "text-transparent" : btnIconActiveColor}`}
                    />
                )}
            </button>
        );
    }

    return (
        <tr className={`flex items-center py-2 ${isLastRow ? "" : "border-b"}`}>
            <td className="w-[87%]">
                <div className="flex items-center">
                    <img className="w-8 h-8 rounded-full mr-4 bg-black" src={memberAvatar} alt="" />
                    <p className="text-lg text-gray-700 truncate">{`${memberName} ${
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
    memberName: PropTypes.string.isRequired,
    memberAvatar: PropTypes.string.isRequired,
    memberRole: PropTypes.number.isRequired,
    userRole: PropTypes.number.isRequired,
    isLastRow: PropTypes.bool.isRequired
};

export default MemberGroupCard;
