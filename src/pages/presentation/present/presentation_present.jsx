/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import socketio from "socket.io-client";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import PresentationMainView from "./main_view";
import QuestionChatBtn from "./question_chat_btn";
import ChangeSlideResultField from "./change_slide_result_field";
import AuthContext from "../../../components/contexts/auth_context";
import ModalFrame from "../../../components/modals/modal_frame";
import PresentResultModalBody from "../../../components/modals/present_result_modal_body";
import { SocketContext } from "../../../components/contexts/socket_context";
import PresentQuestionModalBody from "../../../components/modals/present_question_modal_body/present_question_modal_body";

function PresentationPresentPage() {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const { presentationId, sessionId } = useParams();
    const [roleInThisSession, setRoleInThisSession] = useState(0);
    const [isGetSessionError, setIsGetSessionError] = useState(false);
    const [sessionData, setSessionData] = useState(null);
    const [isGetPresentationError, setIsGetPresentationError] = useState(false);
    const [presentationData, setPresentationData] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [sortBy, setSortBy] = useState(0);
    const [typingQuestion, setTypingQuestion] = useState("");
    const [typingChat, setTypingChat] = useState("");
    const queryClient = useQueryClient();

    const privateAxios = usePrivateAxios();

    const namespace = `/presentation/${presentationId}`;

    const { refetch: presentationQueryRefetch } = useQuery({
        queryKey: ["get_presentation_present_data"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/get?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Presentation data", response);
                    setPresentationData({ ...response?.data });
                    setIsGetPresentationError(false);
                    return response;
                })
                .catch((error) => {
                    console.log("get presentation error");
                    console.log(error);
                    setPresentationData({});
                    setIsGetPresentationError(true);
                });
        }
    });

    const { refetch: sessionQueryRefetch } = useQuery({
        queryKey: ["get_present_session_data"],
        enabled: false,
        queryFn: async () => {
            console.log("sessionId", sessionId);
            return privateAxios
                .get(`session/data?sessionId=${sessionId}`)
                .then(async (response) => {
                    console.log("Session data", response);
                    const session = response?.data;
                    let callPresentationApi = true;
                    if (session?.groupId !== null) {
                        privateAxios
                            .get(`group/getMember?groupId=${session?.groupId}`)
                            .then((responseGroupMember) => {
                                console.log(responseGroupMember);
                                const userRole = responseGroupMember?.data?.role ?? 0;
                                callPresentationApi = userRole > 0 && userRole < 4;
                                if (userRole === 1 || userRole === 2) {
                                    setRoleInThisSession(1);
                                } else if (userRole === 3) {
                                    setRoleInThisSession(2);
                                }
                            });
                    } else if (session?.presenter === user.username) {
                        setRoleInThisSession(1);
                    } else {
                        setRoleInThisSession(2);
                    }
                    if (callPresentationApi) {
                        presentationQueryRefetch();
                    }
                    setSessionData({ ...session });
                    setIsGetSessionError(false);
                    return response;
                })
                .catch((error) => {
                    console.log("get session error");
                    console.log(error);
                    setSessionData({});
                    setIsGetSessionError(true);
                });
        }
    });

    const onChangeSlideBtnClick = (action) => {
        console.log("current index", sessionData?.currentSlideIndex);
        privateAxios
            .get(`session/presentation/move?`, {
                params: {
                    sessionId,
                    slideIndex:
                        parseInt(sessionData?.currentSlideIndex ?? 1, 10) + parseInt(action, 10)
                }
            })
            .then((response) => {
                console.log("Presentation data", response);
                return response;
            })
            .catch((error) => {
                console.log("get change slide error");
                console.log(error);
            });
    };

    useEffect(() => {
        sessionQueryRefetch();
        return () => {
            console.log("Removing cache from present session", sessionId, presentationId);
            setSortBy(0);
            setShowResultModal(false);
            setShowQuestionModal(false);
            queryClient.removeQueries({ queryKey: ["get_presentation_present_data"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_present_session_data"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_slide_present_data"], exact: true });
            setIsGetPresentationError(false);
        };
    }, [sessionId]);

    const getEventName = (eventName) => {
        return `${namespace}/${eventName ?? ""}`;
    };

    const handleSlideChangeEvent = useCallback(({ currentSlideIndex, currentSlideId }) => {
        console.log("new slide index:", currentSlideIndex);
        console.log("new slide id:", currentSlideId);
        setSessionData((currentSessionData) => {
            return { ...currentSessionData, currentSlideIndex: parseInt(currentSlideIndex, 10) };
        });
    }, []);

    useEffect(() => {
        socket.on(getEventName("moveToSlide"), handleSlideChangeEvent);
        return () => {
            socket?.off(getEventName("moveToSlide"), handleSlideChangeEvent);
        };
    }, [socket, namespace, sessionData, handleSlideChangeEvent]);

    if (!sessionData || !presentationData) {
        return null;
    }

    if (!roleInThisSession) {
        return (
            <p className="mt-10 text-center w-full text-neutral-400 text-3xl">
                Only members of group can join this present session.
            </p>
        );
    }

    if (isGetSessionError || isGetPresentationError) {
        return (
            <p className="mt-10 text-center w-full text-neutral-400 text-3xl">
                Cannot get data for this present session.
            </p>
        );
    }

    return (
        <>
            <div className="relative flex flex-col w-full h-full overflow-hidden">
                <PresentationMainView
                    slideId={
                        presentationData?.slides?.[sessionData?.currentSlideIndex ?? 0]?.id ?? 0
                    }
                    isViewer={roleInThisSession === 2}
                />
                <QuestionChatBtn
                    presentationId={parseInt(presentationId, 10)}
                    chatList={[
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "",
                            type: 0,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 0,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 0,
                            time: 0,
                            vote: 2
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "",
                            type: 0,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "",
                            type: 0,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 0,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 0,
                            time: 0,
                            vote: 1
                        }
                    ]}
                    typingText={typingChat}
                    setTypingText={setTypingChat}
                    onQuestionBtnClick={() => setShowQuestionModal(true)}
                />
                {roleInThisSession === 1 ? (
                    <ChangeSlideResultField
                        canMoveLeft={sessionData?.currentSlideIndex > 0}
                        canMoveRight={
                            sessionData?.currentSlideIndex <
                            (presentationData?.slides?.length ?? 0) - 1
                        }
                        onSlideChanged={(action) => onChangeSlideBtnClick(action)}
                        onResultBtnClick={() => setShowResultModal(true)}
                    />
                ) : null}
            </div>
            <ModalFrame
                width="w-[40%]"
                height="h-[80%]"
                clickOutSideToClose={false}
                isVisible={showResultModal}
                onClose={() => setShowResultModal(false)}
            >
                <PresentResultModalBody
                    presentationId={parseInt(presentationId, 10)}
                    presentationName={presentationData?.name ?? ""}
                    resultList={[
                        "{user} choose {option} for {question} at {time} {time}{time}{time}{time}{time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}",
                        "{user} choose {option} for {question} at {time}"
                    ]}
                />
            </ModalFrame>
            <ModalFrame
                width={roleInThisSession === 1 ? "w-[80%]" : "w-[50%]"}
                height="h-[80%]"
                placeSelf={roleInThisSession === 1 ? "" : "place-self-end"}
                clickOutSideToClose={false}
                isVisible={showQuestionModal}
                onClose={() => setShowQuestionModal(false)}
            >
                <PresentQuestionModalBody
                    isPresenter={roleInThisSession === 1}
                    presentationId={parseInt(presentationId, 10)}
                    presentationName={presentationData?.name ?? ""}
                    questionList={[
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "",
                            type: 1,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 1,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 1,
                            time: 0,
                            vote: 2
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "",
                            type: 1,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "",
                            type: 1,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 1,
                            time: 0,
                            vote: 1
                        },
                        {
                            id: 0,
                            user: "ABCD",
                            presentationId,
                            commentText:
                                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                            answerText: "a",
                            type: 1,
                            time: 0,
                            vote: 1
                        }
                    ]}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    typingText={typingQuestion}
                    setTypingText={setTypingQuestion}
                />
            </ModalFrame>
        </>
    );
}

export default PresentationPresentPage;
