import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tabs } from "antd";
import AuthContext from "../../components/contexts/auth_context";
import MainHeader from "../../components/header/main_header/main_header";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import ModalFrame from "../../components/modals/modal_frame";
import RemoveModalBody from "../../components/modals/remove_modal_body";
import MainListGroupsView from "./list_group_view";
import MainLisPresentationsView from "./list_presentations_view";

function Main() {
    const { user } = useContext(AuthContext);
    const [curTabIndex, setCurTabIndex] = useState(1);
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
        isFetching: isOwnPresentationFetching,
        data: ownPresentationListQueryRes,
        refetch: ownPresentationListQueryRefetch
    } = useQuery({
        queryKey: ["get_own_presentation_list"],
        enabled: false,
        queryFn: async () => {
            console.log("run presentation");
            return privateAxios
                .get(`presentation/getByCreator `)
                .then((response) => {
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
        ownPresentationListQueryRefetch();
        collabPresentationListQueryRefetch();
    }, []);

    if (
        !isCreatedGroupFetching &&
        !isJoinedGroupFetching &&
        !isOwnPresentationFetching &&
        !isCollabPresentationFetching &&
        createdGroupListQueryRes &&
        joinedGroupListQueryRes &&
        ownPresentationListQueryRes &&
        collabPresentationListQueryRes
    ) {
        console.log("createdGroupListQueryRes");
        console.log(createdGroupListQueryRes);
        console.log("joinedGroupListQueryRes");
        console.log(joinedGroupListQueryRes);
        console.log("ownPresentationListQueryRes");
        console.log(ownPresentationListQueryRes);
        console.log("collabPresentationListQueryRes");
        console.log(collabPresentationListQueryRes);
    }

    // function renderListPresentation() {
    //     const listOwnPresentation =
    //         ownPresentationListQueryRes?.data !== null &&
    //         ownPresentationListQueryRes?.data !== undefined
    //             ? [...ownPresentationListQueryRes.data]
    //             : [];
    //     const listCollabPresentation =
    //         collabPresentationListQueryRes?.data !== null &&
    //         collabPresentationListQueryRes?.data !== undefined
    //             ? [...collabPresentationListQueryRes.data]
    //             : [];
    //     const listPresentation = listOwnPresentation.concat(listCollabPresentation);
    //     console.log(listPresentation);
    //     function renderListPresentationData() {
    //         if (isOwnPresentationFetching && isCollabPresentationFetching) {
    //             return (
    //                 <div className="flex justify-center ">
    //                     <ImSpinner10 size={50} className="animate-spin mr-3 mb-2" />
    //                 </div>
    //             );
    //         }
    //         if (listPresentation.length > 0) {
    //             return (
    //                 <TablePresentation
    //                     groupName="a"
    //                     dataList={listPresentation}
    //                     onSelectPresentationRemove={(presentationSelected) =>
    //                         setPresentationToRemove(presentationSelected)
    //                     }
    //                 />
    //             );
    //         }
    //         return (
    //             <p className="text-gray-300 text-center text-xl font-bold text-ellipsis mb-3">
    //                 Let create a presentation.
    //             </p>
    //         );
    //     }
    //     return (
    //         <>
    //             <h3 key={`${user.username}_"presentations"`} className="font-semibold text-lg mt-2">
    //                 Presentations
    //             </h3>
    //             {renderListPresentationData()}
    //         </>
    //     );
    // }

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
                <style>{`
                    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                        color: #9333ea !important; 
                        font-weight: 500;
                    }
                    .ant-tabs-tab-btn:hover {
                        color: #9333ea !important;
                    }
                    .ant-tabs-tab.ant-tabs-tab-active:hover {
                        color: #9333ea !important;
                    }
                    .ant-tabs-ink-bar {
                        height: 5px;
                        background: transparent;
                    }
                      
                    .ant-tabs-ink-bar::after {
                        content: " ";
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        height: 2px;
                        background: #9333ea;
                    }
                `}</style>
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
                                    listOwnPresentation={ownPresentationListQueryRes?.data ?? []}
                                    listCollabPresentation={
                                        collabPresentationListQueryRes?.data ?? []
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
