/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import { useContext } from "react";
import { ImSpinner10 } from "react-icons/im";
import MainGroupCard from "../../components/cards/main_group_card";
import AuthContext from "../../components/contexts/auth_context";

function MainListGroupsView({
    isCreatedGroupFetching,
    isJoinedGroupFetching,
    createdByGroups,
    JoinedByGroups
}) {
    const { user } = useContext(AuthContext);

    function renderListGroup(listGroupData, isCreatedByGroup) {
        console.log(listGroupData);
        const isGroupFectching = isCreatedByGroup ? isCreatedGroupFetching : isJoinedGroupFetching;
        const listGroupToRender = listGroupData !== undefined ? [...listGroupData] : [];
        let listGroupView;
        if (isGroupFectching) {
            listGroupView = [
                <div
                    key={`${isCreatedByGroup ? "createdGroupFetching" : "joinedGroupFetching"}`}
                    className="flex justify-center"
                >
                    <ImSpinner10
                        key={`${
                            isCreatedByGroup ? "created_group_loading" : "joined_group_loading"
                        }`}
                        size={50}
                        className="animate-spin mr-3 mb-2"
                    />
                </div>
            ];
        } else {
            const listGroupCard = [];
            let hasGroup = false;
            if (listGroupToRender.length > 0) {
                for (let index = 0; index < listGroupToRender.length; index += 1) {
                    hasGroup = true;
                    listGroupCard.push(
                        <MainGroupCard
                            key={`homeGroup${index}`}
                            groupId={listGroupToRender[index].id}
                            groupName={listGroupToRender[index].name}
                            ownerDisplayName={listGroupToRender[index]?.creator?.displayName ?? ""}
                            ownerAvatar={
                                listGroupToRender[index].creator?.avatarUrl ??
                                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                            }
                        />
                    );
                }
            } else {
                listGroupCard.push(
                    <p
                        key={`${user.username}_${
                            !isCreatedByGroup ? "empty_joined_group" : "empty_created_group"
                        }`}
                        className="text-gray-300 text-center text-xl font-bold text-ellipsis mb-3"
                    >
                        {!isCreatedByGroup ? "Let join in someone group." : "Let create a group."}
                    </p>
                );
            }

            listGroupView = hasGroup
                ? [
                      <div
                          key={`${user.username}_${
                              !isCreatedByGroup
                                  ? "empty_joined_group_title"
                                  : "empty_created_group_title"
                          }`}
                          className="grid lg:grid-cols-4 lg:gap-x-5 md:grid-cols-2 md:gap-x-2 grid-cols-1"
                      >
                          {listGroupCard}
                      </div>
                  ]
                : [...listGroupCard];
        }

        return [
            <h3
                key={`${user.username}_${!isCreatedByGroup ? "joinedGroup" : "createdGroup"}`}
                className="font-semibold text-lg"
            >
                {!isCreatedByGroup ? "Joined group" : "Created group"}
            </h3>,
            [...listGroupView]
        ];
    }
    return (
        <>
            {renderListGroup(createdByGroups, true)}
            {renderListGroup(JoinedByGroups)}
        </>
    );
}

MainListGroupsView.propTypes = {
    isCreatedGroupFetching: PropTypes.bool,
    isJoinedGroupFetching: PropTypes.bool,
    createdByGroups: PropTypes.array,
    JoinedByGroups: PropTypes.array
};
MainListGroupsView.defaultProps = {
    isCreatedGroupFetching: false,
    isJoinedGroupFetching: false,
    createdByGroups: [],
    JoinedByGroups: []
};

export default MainListGroupsView;
