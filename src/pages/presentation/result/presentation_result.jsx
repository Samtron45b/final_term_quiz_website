/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { ImSpinner10 } from "react-icons/im";
import { GiMultipleTargets } from "react-icons/gi";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import AuthContext from "../../../components/contexts/auth_context";
import MainHeader from "../../../components/header/main_header/main_header";
import SimpleMenuBar from "../../../components/side_bars/simple_menu_bar";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import ChoiceResult from "./choice_result";
import QuestionAndChatResult from "./question_chat_result";

function PresentationResultPage() {
    const { presentationId } = useParams();
    const { user } = useContext(AuthContext);
    const [viewIndex, setViewIndex] = useState(0);
    const privateAxios = usePrivateAxios();

    const queryClient = useQueryClient();

    const {
        data: presentationData,
        isFetching: presentationIsFetching,
        isError: presentationIsError,
        refetch: presentationQueryRefetch
    } = useQuery({
        queryKey: ["get_presentation_detail"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/get?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Presentation data", response);
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                });
        }
    });

    const {
        data: collaboratorsData,
        isFetching: collaboratorsIsFetching,
        isError: collaboratorsIsError,
        refetch: collaboratorsQueryRefetch
    } = useQuery({
        queryKey: ["get_presentation_collaborators"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/getCollaborator?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Collaborators data", response);
                    return response;
                })
                .catch((error) => {
                    console.log("get error");
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        presentationQueryRefetch();
        collaboratorsQueryRefetch();
        return () => {
            console.log("Removing from presentation", presentationId);
            queryClient.removeQueries({ queryKey: ["get_presentation_detail"], exact: true });
            queryClient.removeQueries({
                queryKey: ["get_presentation_collaborators"],
                exact: true
            });
        };
    }, [presentationId]);

    if (presentationIsFetching || collaboratorsIsFetching) {
        return (
            <div className="flex h-full justify-center ">
                <ImSpinner10 size={50} className="animate-spin mr-3 mt-[10%]" />
            </div>
        );
    }

    if (!presentationData || !collaboratorsData) {
        return null;
    }

    if (user.username !== presentationData?.data?.creator?.username) {
        const userInList = collaboratorsData?.data?.find((collaborator) => {
            return collaborator.username === user.username;
        });
        if (!userInList) {
            return (
                <p className="mt-10 text-center w-full text-neutral-400 text-3xl">
                    You cannot access this presentation.
                </p>
            );
        }
    }

    function renderChild() {
        // eslint-disable-next-line default-case
        switch (viewIndex) {
            case 0:
                return <ChoiceResult presentationId={parseInt(presentationId, 10)} />;
            case 1:
                return <QuestionAndChatResult presentationId={parseInt(presentationId, 10)} />;
        }
        return null;
    }

    return (
        <>
            <MainHeader />
            <div className="flex justify-center items-center w-full mt-5">
                <h1
                    className={`w-[70%] overflow-hidden ${
                        presentationIsError || collaboratorsIsError
                            ? "text-neutral-300"
                            : "text-black"
                    } font-extrabold text-3xl text-center`}
                >
                    {presentationIsError || collaboratorsIsError
                        ? "Cannot get data for this group."
                        : `Result for presentation "${presentationData?.name}"`}
                </h1>
            </div>
            <div className="content_box flex w-4/5 min-h-[70%] items-top mt-10 ml-[10%]">
                <aside aria-label="Sidebar">
                    <div className="overflow-y-auto w-56 py-3 px-3 bg-white rounded dark:bg-gray-800 border border-neutral-800 shadow-md">
                        <h3 className="font-semibold">Account menu</h3>
                        <SimpleMenuBar
                            viewIndex={viewIndex}
                            setViewIndex={setViewIndex}
                            listItem={[
                                {
                                    text: "Choice result",
                                    icon: GiMultipleTargets
                                },
                                {
                                    text: "Question and chat",
                                    icon: MdOutlineQuestionAnswer
                                }
                            ]}
                        />
                    </div>
                </aside>
                <div className="ml-5 overflow-hidden w-full px-2 py-3 bg-white rounded-lg  shadow-md">
                    {renderChild()}
                </div>
            </div>
        </>
    );
}

export default PresentationResultPage;
