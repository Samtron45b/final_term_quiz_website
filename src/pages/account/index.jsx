// import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import MainHeader from "../../components/header/main_header/main_header";
import SimpleMenuBar from "../../components/side_bars/simple_menu_bar";
import ProfileViewEdit from "../../components/profile_view_edit/profile_view_edit";
import PassswordEdit from "../../components/profile_view_edit/password_edit";
import LocationContext from "../../components/contexts/location_context";

function AccountPage() {
    // const { username } = useParams();
    const [viewIndex, setViewIndex] = useState(0);
    const { location, setLocation } = useContext(LocationContext);

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

    useEffect(() => {
        if (location !== window.location.pathname) {
            setLocation(window.location.pathname);
        }
    }, []);

    return (
        <>
            <MainHeader />
            <div className="content_box flex w-4/5 h-[90%] items-top mt-10 ml-[10%]">
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
                <div className="ml-5 w-full h-96 px-2 py-3 bg-white rounded-lg  shadow-md">
                    {renderChild()}
                </div>
            </div>
        </>
    );
}

export default AccountPage;
