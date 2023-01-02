import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { RiUserAddFill } from "react-icons/ri";
import { MdGroupOff } from "react-icons/md";
import { ImSpinner10 } from "react-icons/im";
import { useQuery, useQueryClient } from "react-query";
import MainHeader from "../../components/header/main_header/main_header";
import TableMember from "./member_table";
import ModalFrame from "../../components/modals/modal_frame";
import AddMemberModalBody from "../../components/modals/add_member_modal_body";
import ChangeMemberRoleModalBody from "../../components/modals/change_member_role_modal_body";
import RemoveModalBody from "../../components/modals/remove_modal_body";
import AuthContext from "../../components/contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import { SocketContext } from "../../components/contexts/socket_context";

function GroupDetailPage() {
    const { groupId } = useParams();
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [isGetGroupError, setIsGetGroupError] = useState(false);
    const [groupDetailData, setGroupDetailData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [memberToChangeRole, setMemberToChangeRole] = useState(null);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const privateAxios = usePrivateAxios();

    const { isFetching: isMemberListQueryFetching, refetch: memberListQueryRefetch } = useQuery({
        queryKey: ["get_member_list"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`group/get?groupId=${groupId}`)
                .then((response) => {
                    console.log(response);
                    setGroupDetailData({ ...response?.data });
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                    setIsGetGroupError(true);
                });
        },
        refetchInterval: 60 * 10 * 1000
    });

    useEffect(() => {
        memberListQueryRefetch();
        return () => {
            queryClient.removeQueries({ queryKey: ["get_member_list"], exact: true });
            setIsGetGroupError(false);
        };
    }, [groupId]);

    const handleOnNewSession = useCallback((newSession) => {
        console.log("new session begun", newSession);
        setGroupDetailData((curGroupDetailData) => {
            return { ...curGroupDetailData, currentSession: { ...newSession } };
        });
    }, []);

    const handleOnEndSession = useCallback(() => {
        console.log("session ended");
        setGroupDetailData((curGroupDetailData) => {
            console.log("group data at end session", curGroupDetailData);
            return { ...curGroupDetailData, currentSession: null };
        });
    }, []);

    useEffect(() => {
        if (groupDetailData) {
            socket.on("newSession", handleOnNewSession);
            socket.on(
                `/presentation/${groupDetailData?.currentSession?.presentationId}/endSession`,
                handleOnEndSession
            );
        }
        return () => {
            socket.off("newSession", handleOnNewSession);
            socket.off(
                `/presentation/${groupDetailData?.currentSession?.presentationId}/endSession`,
                handleOnEndSession
            );
        };
    }, [groupDetailData, handleOnEndSession, handleOnEndSession]);

    let userRole = 0;

    const updateListAfterMemberRolechanged = (memberName, newRole) => {
        setGroupDetailData((currentData) => {
            return {
                ...currentData,
                members: (currentData?.members ?? []).map((member) => {
                    if (member?.username === memberName) {
                        return { ...member, role: newRole };
                    }
                    return { ...member };
                })
            };
        });
        setMemberToChangeRole(null);
    };
    const updateListAfterRemoveMember = (memberName) => {
        setGroupDetailData((currentData) => {
            return {
                ...currentData,
                members: (currentData?.members ?? []).filter((member) => {
                    return member?.username !== memberName;
                })
            };
        });
        setMemberToRemove(null);
    };
    const removeGroup = () => {
        privateAxios.get(`group/delete?groupId=${groupId}`).then((response) => {
            console.log(response);
            navigate(-1);
            return response;
        });
    };

    function renderGroupMems() {
        if (!groupDetailData) return null;

        console.log(groupDetailData);
        const dataList = groupDetailData.members;
        const userInList = dataList.find((element) => {
            return element.username === user.username;
        });
        if (!userInList) {
            return (
                <div className="flex flex-row justify-center text-neutral-400 text-3xl">
                    You are not a member of this group.
                </div>
            );
        }
        userRole = userInList?.role;
        let listOwnerandCo = dataList.filter((mem) => {
            return mem.role === 1;
        });
        listOwnerandCo = listOwnerandCo.concat(
            dataList.filter((mem) => {
                return mem.role === 2;
            })
        );
        const listMember = dataList.filter((mem) => {
            return mem.role === 3;
        });
        console.log(listOwnerandCo);
        console.log(listMember);
        return (
            <>
                {userRole === 1 ? (
                    <div className="flex flex-row space-x-5">
                        <button
                            type="button"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            onClick={() => setShowModal(true)}
                            className="flex items-center mb-3 px-4 py-4 bg-emerald-300 text-white font-medium text-md leading-tight rounded-lg shadow-md hover:bg-emerald-300/75 hover:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                        >
                            <RiUserAddFill size={20} className="text-white mr-1" />
                            Add member
                        </button>
                        <button
                            type="button"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            onClick={() => {
                                setMemberToRemove({
                                    name: `group ${groupDetailData?.name}?`,
                                    onConfirmRemove: async () => removeGroup()
                                });
                            }}
                            className="flex items-center mb-3 px-4 py-4 bg-red-500 text-white font-medium text-md leading-tight rounded-lg shadow-md hover:bg-red-500/75 hover:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                        >
                            <MdGroupOff size={20} className="text-white mr-1" />
                            Delete group
                        </button>
                    </div>
                ) : null}
                <TableMember
                    groupId={parseInt(groupId, 10)}
                    groupName={groupDetailData?.name}
                    title="Owner and Co-owners"
                    userRole={userRole}
                    dataList={listOwnerandCo}
                    onSelectMemberChangeRole={(memberSelected) =>
                        setMemberToChangeRole(memberSelected)
                    }
                    afterMemberDeleted={updateListAfterRemoveMember}
                    onSelectMemberRemove={(memberSelected) => setMemberToRemove(memberSelected)}
                />
                <TableMember
                    groupId={parseInt(groupId, 10)}
                    groupName={groupDetailData?.name}
                    title="Members"
                    userRole={userRole}
                    dataList={listMember}
                    onSelectMemberChangeRole={(memberSelected) =>
                        setMemberToChangeRole(memberSelected)
                    }
                    afterMemberDeleted={updateListAfterRemoveMember}
                    onSelectMemberRemove={(memberSelected) => setMemberToRemove(memberSelected)}
                />
            </>
        );
    }

    const renderPresentationPresentNotiField = () => {
        if (groupDetailData?.currentSession) {
            console.log("group presenting session", groupDetailData?.currentSession);
            return (
                <div className="w-4/5 mt-3 ml-[10%]  p-2 rounded-lg text-white bg-purple-400">
                    <p className="text-xl font-bold">Presenting presentation</p>
                    <p className="text-md font-normal w-full overflow-x-hidden break-words">
                        There is a presentation being presented in this group, click
                        <Link
                            to={`../presentation/${groupDetailData?.currentSession?.presentationId}/present/${groupDetailData?.currentSession?.id}`}
                            className="ml-1 underline decoration-2 font-bold"
                        >
                            join now
                        </Link>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (isMemberListQueryFetching) {
        return (
            <div className="flex h-full justify-center ">
                <ImSpinner10 size={50} className="animate-spin mr-3 mt-[10%]" />
            </div>
        );
    }

    return (
        <>
            <MainHeader />
            <div className="h-[90%] overflow-auto">
                <div className="flex justify-center items-center w-full mt-5">
                    <h1
                        className={`${
                            isGetGroupError ? "text-neutral-300" : "text-black"
                        } font-extrabold text-3xl`}
                    >
                        {isGetGroupError
                            ? "Cannot get data for this group."
                            : `Group ${groupDetailData?.name}`}
                    </h1>
                </div>
                {renderPresentationPresentNotiField()}
                <div className="content_box w-4/5 ml-[10%] items-top mt-5">{renderGroupMems()}</div>
            </div>
            <ModalFrame
                width="w-2/5"
                isVisible={showModal}
                clickOutSideToClose={false}
                onClose={() => setShowModal(false)}
            >
                <AddMemberModalBody
                    groupId={parseInt(groupId, 10)}
                    inviteId={groupDetailData?.inviteId ?? ""}
                />
            </ModalFrame>
            <ModalFrame
                width="w-2/5"
                isVisible={memberToChangeRole !== null}
                clickOutSideToClose={false}
                onClose={() => setMemberToChangeRole(null)}
            >
                <ChangeMemberRoleModalBody
                    groupId={parseInt(groupId, 10)}
                    memberName={memberToChangeRole?.name ?? ""}
                    memberRole={memberToChangeRole?.role ?? 0}
                    memberDisplayName={memberToChangeRole?.displayName ?? ""}
                    afterMemberRoleChanged={updateListAfterMemberRolechanged}
                />
            </ModalFrame>
            <ModalFrame
                width="w-2/5"
                isVisible={memberToRemove !== null}
                clickOutSideToClose={false}
                hasXCloseBtn={false}
                onClose={() => setMemberToRemove(null)}
            >
                <RemoveModalBody
                    objectToRemove={memberToRemove}
                    onClose={() => setMemberToRemove(null)}
                />
            </ModalFrame>
        </>
    );
}

export default GroupDetailPage;
