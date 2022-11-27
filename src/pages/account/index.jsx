import { useParams } from "react-router-dom";
import { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { HiUserGroup } from "react-icons/hi2";
import MainHeader from "../../components/header/main_header/main_header";
import SimpleMenuBar from "../../components/side_bars/simple_menu_bar";

function AccountPage() {
    const { username } = useParams();
    const [viewIndex, setViewIndex] = useState(0);

    return (
        <div className="flex flex-col justify-center items-center">
            <MainHeader />
            <div className="flex justify-center items-center w-full">
                <h1 className="font-extrabold text-3xl">{username}</h1>
            </div>
            <div className="content_box flex flex-col w-4/5 items-top mt-5">
                <aside
                    className="overflow-y-auto w-56 py-3 px-3 bg-white rounded dark:bg-gray-800 border border-neutral-800 shadow-md"
                    aria-label="Sidebar"
                >
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
                </aside>
            </div>
        </div>
    );
}

export default AccountPage;
