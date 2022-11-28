import { useParams } from "react-router-dom";
import { BsPeopleFill } from "react-icons/bs";
import { MdQuiz } from "react-icons/md";
import { useState } from "react";
import { RiUserAddFill } from "react-icons/ri";
import MainHeader from "../../components/header/main_header/main_header";
import SimpleMenuBar from "../../components/side_bars/simple_menu_bar";
import TableMember from "./member_table";
import ModalFrame from "../../components/modals/modal_frame";
import AddMemberModalBody from "../../components/modals/add_member_modal_body";
import ChangeMemberRoleModalBody from "../../components/modals/change_member_role_modal_body";

function GroupDetailPage() {
    const { groupname } = useParams();
    const [viewIndex, setViewIndex] = useState(0);
    const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const [memberToChangeRole, setMemberToChangeRole] = useState(null);

    const userRole = 1;
    const listOwnerandCo = [
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 1
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 2
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 2
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 2
        }
    ];
    const listManager = [
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 3
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 3
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 3
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 3
        }
    ];
    const listMember = [
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 4
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 4
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 4
        },
        {
            memberName: "Nguyen Khanh Huy",
            memberAvatar:
                "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
            memberRole: 4
        }
    ];

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <MainHeader />
                <div className="flex justify-center items-center w-full">
                    <h1 className="font-extrabold text-3xl">{groupname}</h1>
                </div>
                <div className="content_box flex w-4/5 items-top mt-5">
                    <aside aria-label="Sidebar">
                        <div className="w-56 py-3 px-3 bg-white rounded dark:bg-gray-800 border border-neutral-800 shadow-md">
                            <h3 className="font-semibold">Group menu</h3>
                            <SimpleMenuBar
                                viewIndex={viewIndex}
                                setViewIndex={setViewIndex}
                                listItem={[
                                    {
                                        text: "People",
                                        icon: BsPeopleFill
                                    },
                                    {
                                        text: "Quizs",
                                        icon: MdQuiz
                                    }
                                ]}
                            />
                        </div>
                    </aside>
                    <div className="ml-5 w-full px-2 bg-white">
                        {userRole < 4 ? (
                            <button
                                type="button"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                onClick={() => setShowAddGroupModal(true)}
                                className="flex items-center mb-3 px-4 py-4 bg-emerald-300 text-white font-medium text-md leading-tight rounded-lg shadow-md hover:bg-emerald-300/75 hover:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                <RiUserAddFill size={20} className="text-white mr-1" />
                                Add member
                            </button>
                        ) : null}
                        <TableMember
                            title="Owner and Co-owners"
                            dataList={listOwnerandCo}
                            onSelectMemberChangeRole={(memberSelected) =>
                                setMemberToChangeRole(memberSelected)
                            }
                        />
                        <TableMember
                            title="Managers"
                            dataList={listManager}
                            onSelectMemberChangeRole={(memberSelected) =>
                                setMemberToChangeRole(memberSelected)
                            }
                        />
                        <TableMember
                            title="Members"
                            dataList={listMember}
                            onSelectMemberChangeRole={(memberSelected) =>
                                setMemberToChangeRole(memberSelected)
                            }
                        />
                    </div>
                </div>
            </div>
            <ModalFrame
                width="40%"
                isVisible={showAddGroupModal}
                clickOutSideToClose={false}
                onClose={() => setShowAddGroupModal(false)}
            >
                <AddMemberModalBody />
            </ModalFrame>
            <ModalFrame
                width="40%"
                isVisible={memberToChangeRole !== null}
                clickOutSideToClose={false}
                onClose={() => setMemberToChangeRole(null)}
            >
                <ChangeMemberRoleModalBody
                    memberName={memberToChangeRole?.name}
                    memberRole={memberToChangeRole?.role}
                    userRole={userRole}
                />
            </ModalFrame>
        </>
    );
}

export default GroupDetailPage;
