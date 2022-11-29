import PropTypes from "prop-types";
import { Fragment } from "react";
import MemberGroupCard from "../../components/cards/member_group_card";

function TableMember({ title, dataList, onSelectMemberChangeRole, userRole }) {
    console.log(title);
    console.log(dataList);
    const { length } = dataList;

    function renderRows() {
        const rowToRender = [];
        for (let index = 0; index < length; index += 1) {
            const { memberName, memberAvatar, memberRole } = dataList[index];
            rowToRender.push(
                <MemberGroupCard
                    key={`${memberRole}_${index}_card`}
                    userRole={userRole}
                    memberName={memberName}
                    memberAvatar={memberAvatar}
                    memberRole={memberRole}
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
