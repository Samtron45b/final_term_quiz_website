// import { useParams } from "react-router-dom";
import { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { HiUserGroup } from "react-icons/hi2";
import MainHeader from "../../components/header/main_header/main_header";
import SimpleMenuBar from "../../components/side_bars/simple_menu_bar";
import ProfileViewEdit from "../../components/profile_view_edit/profile_view_edit";
import PassswordEdit from "../../components/profile_view_edit/password_edit";

function AccountPage() {
    // const { username } = useParams();
    const [viewIndex, setViewIndex] = useState(0);

    function renderChild() {
        // eslint-disable-next-line default-case
        switch (viewIndex) {
            case 0:
                return <ProfileViewEdit />;
            case 1:
                return <PassswordEdit />;
        }
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <MainHeader />
            <div className="content_box flex w-4/5 items-top mt-5">
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
                                    icon: HiUserGroup
                                }
                            ]}
                        />
                    </div>
                </aside>
                <div className="ml-5 w-full h-96 px-2 py-3 bg-white rounded-lg  shadow-md">
                    {renderChild()}
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
