import PropTypes from "prop-types";
import PresentationCard from "../../components/cards/presentation_card";

function TablePresentation({ dataList, onSelectMemberChangeRole, onSelectMemberRemove }) {
    const { length } = dataList;

    function renderRows() {
        const rowToRender = [];
        for (let index = 0; index < length; index += 1) {
            const { groupname, groupId, canUserEdit, id, name } = dataList[index];
            rowToRender.push(
                <PresentationCard
                    key={`${name}_card`}
                    presentationId={`${id}`}
                    presentationName={name}
                    groupName={groupname ?? "test group lvmnhat"}
                    groupId={groupId ?? "lvmnhatTempGroup"}
                    userCanEdit={canUserEdit ?? true}
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
            <thead className="bg-gray-100 text-xs font-bold text-left text-gray-500 uppercase">
                <tr>
                    <th className="px-6 py-3 ">Name</th>
                    <th className="px-6 py-3 ">Group</th>
                    <th className="px-6 py-3  ">Action</th>
                </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
        </table>
    );
}

TablePresentation.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    dataList: PropTypes.array,
    onSelectMemberChangeRole: PropTypes.func,
    onSelectMemberRemove: PropTypes.func
};
TablePresentation.defaultProps = {
    dataList: [],
    onSelectMemberChangeRole: null,
    onSelectMemberRemove: null
};

export default TablePresentation;
