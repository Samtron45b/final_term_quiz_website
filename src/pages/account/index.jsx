import { useContext, useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import MainHeader from "../../components/header/main_header/main_header";
import SimpleMenuBar from "../../components/side_bars/simple_menu_bar";
import ProfileViewEdit from "../../components/profile_view_edit/profile_view_edit";
import PassswordEdit from "../../components/profile_view_edit/password_edit";
import AuthContext from "../../components/contexts/auth_context";
import ModalFrame from "../../components/modals/modal_frame";
import AuthResultModalBody from "../../components/modals/auth_result_modal_body";

function AccountPage() {
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    const [viewIndex, setViewIndex] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);
    const [messageInstance, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    function renderChild() {
        // eslint-disable-next-line default-case
        switch (viewIndex) {
            case 0:
                return (
                    <ProfileViewEdit
                        messageInstance={messageInstance}
                        showModal={setShowResultModal}
                    />
                );
            case 1:
                return <PassswordEdit messageInstance={messageInstance} />;
        }
        return null;
    }

    return (
        <>
            <MainHeader />
            <div className="content_box flex w-4/5 h-[90%] items-top mt-10 ml-[10%]">
                {username !== user.username ? null : (
                    <>
                        {contextHolder}
                        <aside aria-label="Sidebar">
                            <div className="overflow-y-auto w-56 py-3 px-3 bg-white rounded dark:bg-gray-800 border border-neutral-800 shadow-md">
                                <h3 className="font-semibold">Account menu</h3>
                                <SimpleMenuBar
                                    viewIndex={viewIndex}
                                    setViewIndex={setViewIndex}
                                    listItem={[
                                        {
                                            text: "Profile",
                                            icon: ImProfile
                                        },
                                        {
                                            text: "Change password",
                                            icon: RiLockPasswordFill
                                        },
                                        {
                                            text: "Group setting",
                                            icon: MdGroups
                                        }
                                    ]}
                                />
                            </div>
                        </aside>
                        <div className="ml-5 overflow-hidden w-full max-h-[60%] px-2 py-3 bg-white rounded-lg  shadow-md">
                            {renderChild()}
                        </div>
                    </>
                )}
            </div>
            <ModalFrame
                width="xl:w-1/4 md:w-2/6 sm:w-3/5"
                isVisible={showResultModal}
                hasXCloseBtn={false}
                onClose={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("userData");
                    navigate("/login", { replace: true });
                }}
            >
                <AuthResultModalBody
                    authStatus={3}
                    resultText="Change profile warning"
                    message="It seems like you had changed your attached email. As a way to protect our user, we need you to active your account again through the mail we have just sent to your new email.&#13;Sorry for this inconvenience."
                    onClose={() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("userData");
                        navigate("/login", { replace: true });
                    }}
                />
            </ModalFrame>
        </>
    );
}

export default AccountPage;
