import PropTypes from "prop-types";
import { AiOutlineUserDelete } from "react-icons/ai";
import { MdAssignmentInd } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import AuthContext from "../contexts/auth_context";

function MemberGroupCard({
    groupId,
    groupName,
    memberName,
    memberAvatar,
    memberRole,
    memberDisplayName,
    userRole,
    isLastRow,
    afterMemberDeleted,
    onChangeRoleBtnClick,
    onRemoveBtnClick
}) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const privateAxios = usePrivateAxios();

    async function onDeleteUser() {
        return privateAxios
            .get(`group/kickUser`, {
                params: { groupId, username: memberName }
            })
            .then((response) => {
                console.log(response);
                afterMemberDeleted(memberName);
            });
    }

    function renderMemberName() {
        let nameToRender = memberDisplayName;
        if (memberRole === 1) {
            if (memberDisplayName !== memberName) {
                nameToRender = `${memberDisplayName} (Owner - ${memberName})`;
            } else nameToRender = `${memberDisplayName} (Owner)`;
        } else if (memberDisplayName !== memberName) {
            nameToRender = `${memberDisplayName} (${memberName})`;
        }
        return nameToRender;
    }

    function renderButton(btnType) {
        let btnDisabled;
        let icon;
        if (btnType === 1) {
            btnDisabled = false;
            icon = <ImProfile size={20} className="text-neutral-500" />;
        } else if (btnType === 2) {
            btnDisabled = userRole > 1 || userRole >= memberRole;
            // userRole > 2 || userRole >= memberRole;
            icon = <MdAssignmentInd size={20} className="text-cyan-400" />;
        } else {
            btnDisabled = userRole > 1 || userRole >= memberRole;
            // userRole > 3 || userRole >= memberRole;
            icon = <AiOutlineUserDelete size={20} className="text-red-500" />;
        }
        // const roleBtnDisabled = userRole > 3;
        // const deleteBtnDisabled = userRole > 4;
        // const roleIconColor = `text-${roleBtnDisabled ? "transparent" : "cyan-400"}`;
        // const deleteIconColor = `text-${deleteBtnDisabled ? "transparent" : "red-500"}`;

        return (
            <button
                hidden={btnDisabled}
                type="button"
                className="rounded-full p-3 hover:bg-gray-100"
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
                            name: `member ${
                                memberDisplayName !== memberName
                                    ? `${memberDisplayName} (${memberName})`
                                    : memberDisplayName
                            } from group ${groupName}`,
                            onConfirmRemove: async () => onDeleteUser()
                        });
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
                    <p className="text-lg text-gray-700 truncate">{renderMemberName()}</p>
                </div>
            </td>
            <td className=" py-2">
                <div className="flex items-center justify-end">
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
    groupId: PropTypes.number.isRequired,
    groupName: PropTypes.string.isRequired,
    memberName: PropTypes.string.isRequired,
    memberAvatar: PropTypes.string.isRequired,
    memberRole: PropTypes.number.isRequired,
    memberDisplayName: PropTypes.string.isRequired,
    userRole: PropTypes.number.isRequired,
    isLastRow: PropTypes.bool.isRequired,
    afterMemberDeleted: PropTypes.func,
    onChangeRoleBtnClick: PropTypes.func,
    onRemoveBtnClick: PropTypes.func
};
MemberGroupCard.defaultProps = {
    afterMemberDeleted: null,
    onChangeRoleBtnClick: null,
    onRemoveBtnClick: null
};

export default MemberGroupCard;
