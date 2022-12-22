import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { RiUserAddFill } from "react-icons/ri";
import { ImSpinner10 } from "react-icons/im";
import { useQuery } from "react-query";
import MainHeader from "../../components/header/main_header/main_header";
import TableMember from "./member_table";
import ModalFrame from "../../components/modals/modal_frame";
import AddMemberModalBody from "../../components/modals/add_member_modal_body";
import ChangeMemberRoleModalBody from "../../components/modals/change_member_role_modal_body";
import RemoveModalBody from "../../components/modals/remove_modal_body";
import AuthContext from "../../components/contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function GroupDetailPage() {
    const { groupId } = useParams();
    const { user } = useContext(AuthContext);
    const [isGetGroupError, setIsGetGroupError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [memberToChangeRole, setMemberToChangeRole] = useState(null);
    const [memberToRemove, setMemberToRemove] = useState(null);

    const privateAxios = usePrivateAxios();

    const {
        isFetching: isMemberListQueryFetching,
        data: memberListQueryRes,
        refetch: memberListQueryRefetch
    } = useQuery({
        queryKey: ["get_member_list"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`group/get?groupId=${groupId}`)
                .then((response) => {
                    console.log(response);
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
        return () => setIsGetGroupError(false);
    }, [groupId]);

    let userRole = 0;

    function renderGroupMems() {
        if (!memberListQueryRes) return null;

        console.log(memberListQueryRes);
        const dataList = memberListQueryRes.data.members;
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
        const listOwnerandCo = dataList.filter((mem) => {
            return mem.role === 1 || mem.role === 2;
        });
        const listMember = dataList.filter((mem) => {
            return mem.role === 3;
        });
        console.log(listOwnerandCo);
        console.log(listMember);
        return (
            <>
                {userRole === 1 ? (
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
                ) : null}
                <TableMember
                    groupId={parseInt(groupId, 10)}
                    groupName={memberListQueryRes?.data?.name}
                    title="Owner and Co-owners"
                    userRole={userRole}
                    dataList={listOwnerandCo}
                    onSelectMemberChangeRole={(memberSelected) =>
                        setMemberToChangeRole(memberSelected)
                    }
                    onSelectMemberRemove={(memberSelected) => setMemberToRemove(memberSelected)}
                />
                {/* <TableMember
                    title="Managers"
                    userRole={userRole}
                    dataList={listManager}
                    onSelectMemberChangeRole={(memberSelected) =>
                        setMemberToChangeRole(memberSelected)
                    }
                /> */}
                <TableMember
                    groupId={parseInt(groupId, 10)}
                    groupName={memberListQueryRes?.data?.name}
                    title="Members"
                    userRole={userRole}
                    dataList={listMember}
                    onSelectMemberChangeRole={(memberSelected) =>
                        setMemberToChangeRole(memberSelected)
                    }
                    onSelectMemberRemove={(memberSelected) => setMemberToRemove(memberSelected)}
                />
            </>
        );
    }

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
            <div className="h-[90%]">
                <div className="flex justify-center items-center w-full mt-5">
                    <h1
                        className={`${
                            isGetGroupError ? "text-neutral-300" : "text-black"
                        } font-extrabold text-3xl`}
                    >
                        {isGetGroupError
                            ? "Cannot get data for this group."
                            : `Group ${memberListQueryRes?.data?.name}`}
                    </h1>
                </div>
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
                    inviteId={memberListQueryRes?.data?.inviteId ?? ""}
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
