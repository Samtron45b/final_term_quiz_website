import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import MainGroupCard from "../../components/cards/main_group_card";
import MainHeader from "../../components/header/main_header/main_header";

function Main() {
    localStorage.setItem("currentRoute", "/");

    const getQuotes = async () => {
        const res = await fetch("https://api.quotable.io/random");
        return res.json();
    };

    const { data, error, isLoading } = useQuery("randomQuotes", getQuotes, {
        refetchInterval: 6000
    });

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

    if (error) console.log(error);
    if (isLoading) console.log(error);
    // Show the response if everything is fine
    return (
        <div>
            <MainHeader />
            <h1>Random Quotes:</h1>
            <p className="mb-2">{data?.content ?? ""}</p>
            <div className="flex space-x-4 text-gray-500">
                <Link
                    to="/login"
                    className="no-underline hover:no-underline hover:text-blue-800 font-bold"
                >
                    <div className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                        Sign in
                    </div>
                </Link>

                <Link
                    to="/register"
                    className="no-underline hover:no-underline hover:text-blue-800 font-bold"
                >
                    <div className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-teal-700 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600">
                        Register
                    </div>
                </Link>
            </div>
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
