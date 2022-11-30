import PropTypes from "prop-types";
import { Fragment } from "react";
import MemberGroupCard from "../../components/cards/member_group_card";

function TableMember({ groupName, title, dataList, onSelectMemberChangeRole, userRole }) {
    // console.log(title);
    // console.log(dataList);
    const { length } = dataList;

    function renderRows() {
        const rowToRender = [];
        for (let index = 0; index < length; index += 1) {
            const { username, useravatar, isOwner, displayName } = dataList[index];
            rowToRender.push(
                <MemberGroupCard
                    key={`${isOwner === 1 ? 1 : 4}_${index}_card`}
                    groupName={groupName}
                    userRole={userRole}
                    memberName={username}
                    memberAvatar={useravatar}
                    memberRole={isOwner === 1 ? 1 : 4}
                    memberDisplayName={displayName}
                    isLastRow={index === length - 1}
                    onChangeRoleBtnClick={onSelectMemberChangeRole}
                />
            );
        }
        return rowToRender;
    }

    if (length === 0) return null;

    return (
        <>
            <div className="flex border-b-2 border-purple-700">
                <div className="grow pb-2 text-purple-600 text-lg font-bold">{title}</div>
            </div>
            <table className="mb-2 w-full border-collapse table-auto">
                <thead />
                <tbody>{renderRows()}</tbody>
            </table>
        </>
    );
}

TableMember.propTypes = {
    groupName: PropTypes.string.isRequired,
    title: PropTypes.string,
    userRole: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    dataList: PropTypes.array,
    onSelectMemberChangeRole: PropTypes.func
};
TableMember.defaultProps = {
    title: "",
    dataList: [],
    onSelectMemberChangeRole: null
};

export default TableMember;
