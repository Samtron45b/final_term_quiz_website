import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tabs } from "antd";
import MainHeader from "../../components/header/main_header/main_header";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import ModalFrame from "../../components/modals/modal_frame";
import RemoveModalBody from "../../components/modals/remove_modal_body";
import MainListGroupsView from "./list_group_view";
import MainLisPresentationsView from "./list_presentations_view";

function Main() {
    const [curTabIndex, setCurTabIndex] = useState(1);
    const [myPresentationData, setMyPresentationData] = useState([]);
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
                .get(`group/createdBy`)
                .then((response) => {
                    console.log("created groups", response);
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
                .get(`group/joinedBy`)
                .then((response) => {
                    console.log("joined groups", response);
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
    const { isFetching: isOwnPresentationFetching, refetch: ownPresentationListQueryRefetch } =
        useQuery({
            queryKey: ["get_own_presentation_list"],
            enabled: false,
            queryFn: async () => {
                console.log("run presentation");
                return privateAxios
                    .get(`presentation/getByCreator`)
                    .then((response) => {
                        console.log("own presentations", response);
                        setMyPresentationData(response?.data);
                        return response;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    const {
        isFetching: isCollabPresentationFetching,
        data: collabPresentationListQueryRes,
        refetch: collabPresentationListQueryRefetch
    } = useQuery({
        queryKey: ["get_collab_presentation_list"],
        enabled: false,
        queryFn: async () => {
            console.log("run presentation");
            return privateAxios
                .get(`presentation/getByCollab`)
                .then((response) => {
                    console.log("collaborate presentations", response);
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    const updateOwnPresentationListAfterRemove = (removedPresentationId) => {
        setMyPresentationData((myCurPresentationList) => {
            return myCurPresentationList.filter((presentation) => {
                return presentation.id !== removedPresentationId;
            });
        });
        setPresentationToRemove(null);
    };

    useEffect(() => {
        console.log("call all list api");
        createdGroupListQueryRefetch();
        joinedGroupListQueryRefetch();
        ownPresentationListQueryRefetch();
        collabPresentationListQueryRefetch();
    }, []);

    // Show the response if everything is fine
    return (
        <>
            <MainHeader />
            <div className="flex justify-center items-center w-full mt-5">
                <h1 className="text-purple-700 font-extrabold text-3xl">
                    {curTabIndex === 1 ? "List Presentations" : "List Groups"}
                </h1>
            </div>
            <div className="px-40 mt-5">
                <Tabs
                    activeKey={`${curTabIndex}`}
                    centered
                    onChange={(activeKey) => setCurTabIndex(parseInt(activeKey, 10))}
                    items={[
                        {
                            label: `List presentations`,
                            key: "1",
                            children: (
                                <MainLisPresentationsView
                                    isOwnPresentationFetching={isOwnPresentationFetching}
                                    isCollabPresentationFetching={isCollabPresentationFetching}
                                    listOwnPresentation={myPresentationData}
                                    listCollabPresentation={
                                        collabPresentationListQueryRes?.data ?? []
                                    }
                                    onSelectPresentationRemove={setPresentationToRemove}
                                    updateAfterRemovePresentation={
                                        updateOwnPresentationListAfterRemove
                                    }
                                />
                            )
                        },
                        {
                            label: `List groups`,
                            key: "2",
                            children: (
                                <MainListGroupsView
                                    isCreatedGroupFetching={isCreatedGroupFetching}
                                    isJoinedGroupFetching={isJoinedGroupFetching}
                                    createdByGroups={createdGroupListQueryRes?.data ?? []}
                                    JoinedByGroups={joinedGroupListQueryRes?.data ?? []}
                                />
                            )
                        }
                    ]}
                />
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
