import React from "react";
import MainGroupCard from "../../components/cards/main_group_card";
import MainHeader from "../../components/header/main_header/main_header";

function Main() {
    localStorage.setItem("currentRoute", "/");

    const listCreatedGroup = [
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        }
    ];
    const listJoinnedGroup = [
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        },
        {
            groupName: "Group Web Nang Cao",
            ownerName: "Nguyen Khanh Huy"
        }
    ];

    function renderListGroup(listGroupToRender) {
        const listGroupView = [];
        for (let index = 0; index < listGroupToRender.length; index += 1) {
            listGroupView.push(
                <MainGroupCard
                    key={`homeGroup${index}`}
                    groupName={listGroupToRender[index].groupName}
                    ownerName={listGroupToRender[index].ownerName}
                />
            );
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
                <div>
                    <h3 className="font-semibold text-lg">Created group</h3>
                    <div className="grid grid-cols-4 gap-x-5">
                        {renderListGroup(listCreatedGroup)}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Joined group</h3>
                    <div className="grid grid-cols-4 gap-x-5">
                        {renderListGroup(listJoinnedGroup)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
