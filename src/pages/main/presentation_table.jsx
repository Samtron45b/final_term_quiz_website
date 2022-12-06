import PropTypes from "prop-types";
import MemberGroupCard from "../../components/cards/member_group_card";

function TablePresentation({
    presentationName,
    dataList,
    onSelectMemberChangeRole,
    onSelectMemberRemove,
    ownerName,
    ownerDisplayName
}) {
    const { length } = dataList;

    console.log(ownerDisplayName);

    function renderRows() {
        const rowToRender = [];
        for (let index = 0; index < length; index += 1) {
            const { username, useravatar, role, displayName } = dataList[index];
            rowToRender.push(
                <MemberGroupCard
                    key={`${ownerName}_${index}_card`}
                    presentationName={presentationName}
                    ownerName={ownerName}
                    memberName={username}
                    memberAvatar={
                        useravatar ??
                        "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                    }
                    memberRole={role}
                    memberDisplayName={displayName}
                    isLastRow={index === length - 1}
                    onChangeRoleBtnClick={onSelectMemberChangeRole}
                    onRemoveBtnClick={onSelectMemberRemove}
                />
            );
        }
        return rowToRender;
    }

    // if (length === 0) return null;

    return (
        <table className="mb-2 w-full border-collapse table-auto">
            <thead className="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                        Name
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                    >
                        Email
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                    >
                        Edit
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                    >
                        Delete
                    </th>
                </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
        </table>
    );
}

TablePresentation.propTypes = {
    presentationName: PropTypes.string,
    ownerName: PropTypes.string,
    ownerDisplayName: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    dataList: PropTypes.array,
    onSelectMemberChangeRole: PropTypes.func,
    onSelectMemberRemove: PropTypes.func
};
TablePresentation.defaultProps = {
    presentationName: "",
    dataList: [],
    ownerName: "",
    ownerDisplayName: "",
    onSelectMemberChangeRole: null,
    onSelectMemberRemove: null
};

export default TablePresentation;
