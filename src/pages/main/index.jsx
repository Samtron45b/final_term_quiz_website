import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ImSpinner10 } from "react-icons/im";
import MainGroupCard from "../../components/cards/main_group_card";
import AuthContext from "../../components/contexts/auth_context";
import MainHeader from "../../components/header/main_header/main_header";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import TablePresentation from "./presentation_table";
import ModalFrame from "../../components/modals/modal_frame";
import RemoveModalBody from "../../components/modals/remove_modal_body";

function Main() {
    const { user } = useContext(AuthContext);
    const [presentationToRemove, setPresentationToRemove] = useState(null);
    if (presentationToRemove !== null) {
        console.log(presentationToRemove);
    }
    const privateAxios = usePrivateAxios();
    const {
        isFetching: isCreatedGroupFetching,
        data: createdGroupListQueryRes,
        refetch: createdGroupListQueryRefetch
    } = useQuery({
        queryKey: ["get_created_group_list"],
        enabled: false,
        queryFn: async () => {
            console.log("run created by");
            return privateAxios
                .get(`group/createdBy`, { params: { username: user.username } })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
    const {
        isFetching: isJoinedGroupFetching,
        data: joinedGroupListQueryRes,
        refetch: joinedGroupListQueryRefetch
    } = useQuery({
        queryKey: ["get_joined_group_list"],
        enabled: false,
        queryFn: async () => {
            console.log("run joined by");
            return privateAxios
                .get(`group/joinedBy`, { params: { username: user.username } })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
    const {
        isFetching: isPresentationFetching,
        data: presentationListQueryRes,
        refetch: presentationListQueryRefetch
    } = useQuery({
        queryKey: ["get_presentation_list"],
        enabled: false,
        queryFn: async () => {
            console.log("run presentation");
            return privateAxios
                .get(`presentation/get`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        createdGroupListQueryRefetch();
        joinedGroupListQueryRefetch();
        presentationListQueryRefetch();
    }, []);

    if (
        !isCreatedGroupFetching &&
        !isJoinedGroupFetching &&
        !isPresentationFetching &&
        createdGroupListQueryRes &&
        joinedGroupListQueryRes &&
        presentationListQueryRes
    ) {
        console.log("createdGroupListQueryRes");
        console.log(createdGroupListQueryRes);
        console.log("joinedGroupListQueryRes");
        console.log(joinedGroupListQueryRes);
        console.log("presentationListQueryRes");
        console.log(presentationListQueryRes);
    }

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

    function renderListPresentation() {
        console.log(presentationListQueryRes?.data ?? []);
        const listPresentation =
            presentationListQueryRes?.data !== null && presentationListQueryRes?.data !== undefined
                ? [...presentationListQueryRes.data]
                : [];
        function renderListPresentationData() {
            if (isPresentationFetching) {
                return (
                    <div className="flex justify-center ">
                        <ImSpinner10 size={50} className="animate-spin mr-3 mb-2" />
                    </div>
                );
            }
            if (listPresentation.length > 0) {
                return (
                    <TablePresentation
                        groupName="a"
                        dataList={listPresentation}
                        onSelectPresentationRemove={(presentationSelected) =>
                            setPresentationToRemove(presentationSelected)
                        }
                    />
                );
            }
            return (
                <p className="text-gray-300 text-center text-xl font-bold text-ellipsis mb-3">
                    Let create a presentation.
                </p>
            );
        }
        return (
            <>
                <h3 key={`${user.username}_"presentations"`} className="font-semibold text-lg mt-2">
                    Presentations
                </h3>
                {renderListPresentationData()}
            </>
        );
    }

    // Show the response if everything is fine
    return (
        <>
            <MainHeader />
            <div className="flex justify-center items-center w-full mt-5">
                <h1 className="text-purple-700 font-extrabold text-3xl">List Groups</h1>
            </div>
            <div className="px-40 mt-5">
                {renderListGroup(createdGroupListQueryRes?.data, true)}
                {renderListGroup(joinedGroupListQueryRes?.data)}
                {renderListPresentation()}
            </div>
            <ModalFrame
                width="w-2/5"
                isVisible={presentationToRemove !== null}
                clickOutSideToClose={false}
                hasXCloseBtn={false}
                onClose={() => setPresentationToRemove(null)}
            >
                <RemoveModalBody
                    objectToRemove={presentationToRemove}
                    onClose={() => setPresentationToRemove(null)}
                />
            </ModalFrame>
        </>
    );
}

export default Main;
