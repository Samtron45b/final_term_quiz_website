import PropTypes from "prop-types";
import MemberGroupCard from "../../components/cards/member_group_card";

function TableMember({ title, dataList }) {
    console.log(title);
    console.log(dataList);
    const { length } = dataList;

    function renderRows() {
        const rowToRender = [];
        for (let index = 0; index < length; index += 1) {
            const { memberName, memberAvatar, memberRole } = dataList[index];
            rowToRender.push(
                <MemberGroupCard
                    userRole={4}
                    memberName={memberName}
                    memberAvatar={memberAvatar}
                    memberRole={memberRole}
                    isLastRow={index === length - 1}
                />
            );
        }
        return rowToRender;
    }

    if (length === 0) return null;

    return (
        <div className="block">
            <div className="flex border-b-2 border-purple-700">
                <div className="grow pb-2 text-purple-600 text-lg font-bold">{title}</div>
            </div>
            <table className="mb-2 w-full border-collapse table-auto">
                <thead />
                <tbody>{renderRows()}</tbody>
            </table>
        </div>
    );
}

TableMember.propTypes = {
    title: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    dataList: PropTypes.array
};
TableMember.defaultProps = {
    title: "",
    dataList: []
};

export default TableMember;
