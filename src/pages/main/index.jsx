import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import MainGroupCard from "../../components/cards/main_group_card";
import AuthContext from "../../components/contexts/auth_context";
import LocationContext from "../../components/contexts/location_context";
import MainHeader from "../../components/header/main_header/main_header";

function Main() {
    const { user } = useContext(AuthContext);
    const { location, setLocation } = useContext(LocationContext);
    const { data: createdGroupListQueryRes, refetch: createdGroupListQueryRefetch } = useQuery({
        queryKey: ["get_created_group_list"],
        enabled: false,
        queryFn: async () => {
            return axios
                .get(
                    `https://45d6-2402-800-63b6-df31-61e7-55fc-79cc-bfa1.ap.ngrok.io/group/createdBy?username=${user.username}`
                )
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
    const { data: joinedGroupListQueryRes, refetch: joinedGroupListQueryRefetch } = useQuery({
        queryKey: ["get_created_group_list"],
        enabled: false,
        queryFn: async () => {
            return axios
                .get(
                    `https://45d6-2402-800-63b6-df31-61e7-55fc-79cc-bfa1.ap.ngrok.io/group/joinedBy?username=${user.username}`
                )
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        if (location !== window.location.pathname) {
            setLocation(window.location.pathname);
        }
        createdGroupListQueryRefetch();
        joinedGroupListQueryRefetch();
    }, []);

    if (createdGroupListQueryRes && joinedGroupListQueryRes) {
        console.log(createdGroupListQueryRes);
        console.log(joinedGroupListQueryRes);
    }

    function renderListGroup(listGroupToRender) {
        const listGroupView = [];
        if (listGroupToRender) {
            for (let index = 0; index < listGroupToRender.length; index += 1) {
                listGroupView.push(
                    <MainGroupCard
                        key={`homeGroup${index}`}
                        groupName={listGroupToRender[index].name}
                        ownerName={listGroupToRender[index].creator}
                        ownerAvatar={
                            listGroupToRender[index].ownerAvatar ??
                            "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                        }
                    />
                );
            }
        }
        return listGroupView;
    }

    // Show the response if everything is fine
    return (
        <div>
            <MainHeader />
            <div className="flex justify-center items-center w-full">
                <h1 className="text-purple-700 font-extrabold text-3xl">List Groups</h1>
            </div>
            <div className="px-40 mt-5">
                {createdGroupListQueryRes?.data?.data?.length > 0 ? (
                    <div>
                        <h3 className="font-semibold text-lg">Created group</h3>
                        <div className="grid lg:grid-cols-4 lg:gap-x-5 md:grid-cols-2 md:gap-x-2 grid-cols-1">
                            {renderListGroup(createdGroupListQueryRes?.data?.data)}
                        </div>
                    </div>
                ) : null}
                {joinedGroupListQueryRes?.data?.data?.length > 0 ? (
                    <div>
                        <h3 className="font-semibold text-lg">Joined group</h3>
                        <div className="grid lg:grid-cols-4 lg:gap-x-5 md:grid-cols-2 md:gap-x-2 grid-cols-1">
                            {renderListGroup(joinedGroupListQueryRes?.data?.data)}
                        </div>
                    </div>
                ) : null}
                {createdGroupListQueryRes?.data?.data?.length === 0 &&
                joinedGroupListQueryRes?.data?.data?.length === 0 ? (
                    <p className="text-gray-300 text-center text-xl font-bold text-ellipsis">
                        Your group list is empty. Let create one or join in someone group.
                    </p>
                ) : null}
            </div>
        </div>
    );
}

export default Main;
