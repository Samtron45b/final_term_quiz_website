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
            console.log("run created by");
            const token = localStorage.getItem("accessToken");
            return axios
                .get(`${process.env.REACT_APP_BASE_URL}group/createdBy?username=${user.username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
    const { data: joinedGroupListQueryRes, refetch: joinedGroupListQueryRefetch } = useQuery({
        queryKey: ["get_joined_group_list"],
        enabled: false,
        queryFn: async () => {
            console.log("run joined by");
            const token = localStorage.getItem("accessToken");

            return axios
                .get(`${process.env.REACT_APP_BASE_URL}group/joinedBy?username=${user.username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
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

    function renderListGroup(listGroupData, creator) {
        let listGroupToRender = [...listGroupData];
        if (!creator) {
            listGroupToRender = listGroupData.filter((group) => {
                return group.creator.username !== user.username;
            });
        }
        const listGroupCard = [];
        let hasGroup = false;
        if (listGroupToRender.length > 0) {
            for (let index = 0; index < listGroupToRender.length; index += 1) {
                hasGroup = true;
                listGroupCard.push(
                    <MainGroupCard
                        key={`homeGroup${index}`}
                        groupName={listGroupToRender[index].name}
                        ownerDisplayName={
                            !creator
                                ? listGroupToRender[index]?.creator?.displayName ?? ""
                                : creator.displayName
                        }
                        ownerAvatar={
                            listGroupToRender[index].ownerAvatar ??
                            "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                        }
                    />
                );
            }
        } else {
            listGroupCard.push(
                <p
                    key={`${user.username}_${
                        !creator ? "empty_joined_group" : "empty_created_group"
                    }`}
                    className="text-gray-300 text-center text-xl font-bold text-ellipsis"
                >
                    {!creator ? "Let join in someone group." : "Let create a group."}
                </p>
            );
        }

        const listGroupView = hasGroup
            ? [
                  <div className="grid lg:grid-cols-4 lg:gap-x-5 md:grid-cols-2 md:gap-x-2 grid-cols-1">
                      {listGroupCard}
                  </div>
              ]
            : [...listGroupCard];

        return [
            <h3
                key={`${user.username}_${!creator ? "joinedGroup" : "createdGroup"}`}
                className="font-semibold text-lg"
            >
                {!creator ? "Joined group" : "Created group"}
            </h3>,
            [...listGroupView]
        ];
    }

    // Show the response if everything is fine
    return (
        <div>
            <MainHeader />
            <div className="flex justify-center items-center w-full">
                <h1 className="text-purple-700 font-extrabold text-3xl">List Groups</h1>
            </div>
            <div className="px-40 mt-5">
                {createdGroupListQueryRes?.data?.data?.groups?.length > 0 ? (
                    <>
                        {renderListGroup(
                            createdGroupListQueryRes?.data?.data?.groups,
                            createdGroupListQueryRes?.data?.data?.creator
                        )}
                    </>
                ) : null}
                {joinedGroupListQueryRes?.data?.data?.length > 0 ? (
                    <>{renderListGroup(joinedGroupListQueryRes?.data?.data)}</>
                ) : null}
                {createdGroupListQueryRes?.data?.data?.groups?.length === 0 &&
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
