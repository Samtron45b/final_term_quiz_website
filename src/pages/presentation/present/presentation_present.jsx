/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import PresentationMainView from "./main_view";
import QuestionChatBtn from "./question_chat_btn";
import ChangeSlideResultField from "./change_slide_result_field";
import AuthContext from "../../../components/contexts/auth_context";
import ModalFrame from "../../../components/modals/modal_frame";
import PresentResultModalBody from "../../../components/modals/present_result_modal_body";
import { SocketContext } from "../../../components/contexts/socket_context";
import PresentQuestionModalBody from "../../../components/modals/present_question_modal_body/present_question_modal_body";
import EndPresentationNotifyModalBody from "../../../components/modals/end_presentation_modal_body/end_presentation_notify_modal_body";
import EndPresentationConfirmModalBody from "../../../components/modals/end_presentation_modal_body/end_presentation_comfirm_modal_body";

function PresentationPresentPage() {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const { presentationId, sessionId } = useParams();
    const [roleInThisSession, setRoleInThisSession] = useState(0);
    const [isGetSessionError, setIsGetSessionError] = useState(false);
    const [sessionData, setSessionData] = useState(null);
    const [isGetPresentationError, setIsGetPresentationError] = useState(false);
    const [presentationData, setPresentationData] = useState(null);
    const [resultData, setResultData] = useState([]);
    const [questionData, setQuestionData] = useState([]);
    const [chatData, setChatData] = useState([]);
    const [chatDataWithPagination, setChatDataWithPagination] = useState([]);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showEndConfirmModal, setShowEndConfirmModal] = useState(false);
    const [showEndNotifyModal, setShowEndNotifyModal] = useState(false);
    const [sortBy, setSortBy] = useState(0);
    const [typingQuestion, setTypingQuestion] = useState("");
    const [typingChat, setTypingChat] = useState("");
    const [willScrollChatToBottom, setWillScrollChatToBottom] = useState(true);
    const [newMessageAmount, setNewMessageAmount] = useState(0);
    const queryClient = useQueryClient();

    const privateAxios = usePrivateAxios();

    const questionBoxController = useRef();
    const chatBoxController = useRef();
    const isChatBoxAtBottom = useRef(true);
    const needInitialChatBox = useRef(false);

    const namespace = `/presentation/${presentationId}/`;

    console.log("update on scroll", isChatBoxAtBottom);

    // handle on chatbox scroll event:
    const handleOnChatBoxScroll = (chatbox) => {
        const { scrollHeight, scrollTop, clientHeight } = chatbox;
        const totalScrollTopnClientHeight = Math.ceil(scrollTop + clientHeight);
        if (totalScrollTopnClientHeight < scrollHeight && isChatBoxAtBottom.current) {
            isChatBoxAtBottom.current = false;
        }
        if (totalScrollTopnClientHeight >= scrollHeight) {
            setNewMessageAmount(0);
            if (!isChatBoxAtBottom.current) {
                isChatBoxAtBottom.current = true;
            }
        }
    };

    useEffect(() => {
        if (chatBoxController.current) {
            const { scrollTop, clientHeight, scrollHeight } = chatBoxController.current;
            const totalScrollTopClientHeight = Math.ceil(scrollTop + clientHeight);
            if (scrollHeight > 0) {
                isChatBoxAtBottom.current = totalScrollTopClientHeight === scrollHeight;
            }
            chatBoxController.current.addEventListener("scroll", (event) => {
                handleOnChatBoxScroll(event.target);
            });
        }
        return () => {
            if (chatBoxController.current) {
                chatBoxController.current.removeEventListener("scroll", (event) => {
                    handleOnChatBoxScroll(event.target);
                });
            }
        };
    });

    // call api
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

    const { refetch: resulQueryRefetch } = useQuery({
        queryKey: ["get_presentation_result_data"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/answerByPresentaion?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Result data", response);
                    setResultData((response?.data ?? []).concat());
                    setIsGetPresentationError(false);
                    return response;
                })
                .catch((error) => {
                    console.log("get result error");
                    console.log(error);
                    setPresentationData({});
                    setIsGetPresentationError(true);
                });
        }
    });

    const { refetch: commentQueryRefetch } = useQuery({
        queryKey: ["get_presentation_comment_data"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`session/comment/of?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Comment data", response);
                    const commentData = (response?.data ?? []).concat([]);
                    setQuestionData(commentData.filter((comment) => comment.type === 1));
                    const chatList = commentData.filter((comment) => comment.type === 0);
                    setChatData(chatList.concat([]));
                    if (chatList.length > 0) {
                        needInitialChatBox.current = true;
                    }
                    setIsGetPresentationError(false);
                    return response;
                })
                .catch((error) => {
                    console.log("get comments error");
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
                        await privateAxios
                            .get(`group/getMember?groupId=${session?.groupId}`)
                            .then((responseGroupMember) => {
                                console.log("responseGroupMember", responseGroupMember);
                                const userRole = responseGroupMember?.data?.role ?? 0;
                                callPresentationApi = userRole > 0 && userRole < 4;
                                if (userRole === 1 || userRole === 2) {
                                    setRoleInThisSession(1);
                                } else if (userRole === 3) {
                                    setRoleInThisSession(2);
                                }
                            })
                            .catch(() => {
                                callPresentationApi = false;
                                setRoleInThisSession(0);
                            });
                    } else if (session?.presenter === user.username) {
                        setRoleInThisSession(1);
                    } else {
                        setRoleInThisSession(2);
                    }
                    if (callPresentationApi) {
                        await Promise.all([
                            presentationQueryRefetch(),
                            resulQueryRefetch(),
                            commentQueryRefetch()
                        ]);
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

    const endPresentationSession = async () => {
        const presentationSessionText = `presentation ${presentationId} session ${sessionId}`;
        console.log(`call end session api for ${presentationSessionText}`);
        privateAxios
            .get(`session/presentation/end?`, { params: { sessionId } })
            .then((response) => {
                console.log(`${presentationSessionText} ended`, response);
                return response;
            })
            .catch((error) => {
                console.log(`Failed to end ${presentationSessionText}`);
                console.log(error);
            });
    };

    const cleanUpSessionData = () => {
        setSessionData(null);
        setPresentationData(null);
        setRoleInThisSession(0);
        setIsGetSessionError(false);
        setIsGetPresentationError(false);
        setResultData([]);
        setQuestionData([]);
        setChatData([]);
        setChatDataWithPagination([]);
        setShowResultModal(false);
        setShowQuestionModal(false);
        setShowEndConfirmModal(false);
        setShowEndNotifyModal(false);
        setSortBy(0);
        setTypingQuestion("");
        setTypingChat("");
        setWillScrollChatToBottom(true);
        setNewMessageAmount(0);
        chatBoxController.current?.disconnect();
        isChatBoxAtBottom.current = true;
        needInitialChatBox.current = false;
    };

    useEffect(() => {
        sessionQueryRefetch();
        setShowEndConfirmModal(false);
        setShowEndNotifyModal(false);
        return () => {
            console.log("Removing cache from present session", sessionId, presentationId);
            queryClient.removeQueries({ queryKey: ["get_presentation_present_data"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_present_session_data"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_slide_present_data"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_presentation_result_data"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_presentation_comment_data"], exact: true });
            cleanUpSessionData();
        };
    }, [sessionId]);

    // handle load more
    const getListCommentByIds = async (curPage, length, type) => {
        const idSource = type === 0 ? chatData.concat([]) : questionData.concat([]);
        let startIndex = idSource.length - (type === 0 ? curPage : 0) * length;
        const endIndex = startIndex + length - 1;
        if (startIndex < 0) startIndex = 0;
        let listIdsString = "";
        for (let i = startIndex; i <= endIndex; i += 1) {
            listIdsString += `id=${idSource[i].id}`;
            if (i < endIndex) {
                listIdsString += "&";
            }
        }
        console.log("list ids", listIdsString);
        privateAxios
            .get(`session/comment/data?${listIdsString}`)
            .then((response) => {
                console.log("list comment by ids", response);
                if (type === 0) {
                    setChatDataWithPagination((curChatDataWithPagination) => {
                        return (response?.data ?? []).concat(curChatDataWithPagination);
                    });
                }
                return response;
            })
            .catch((error) => {
                console.log("get list comments by ids error");
                console.log(error);
            });
    };

    // useEffect(() => {
    //     if (needInitialChatBox.current) {
    //         if (chatData.length > 0) {
    //             console.log("run herer");
    //             getListCommentByIds(1, 10, 0);
    //         }
    //         needInitialChatBox.current = false;
    //     }
    // }, [chatData]);

    // socket event handlers
    const getEventName = (eventName) => {
        return `${namespace}${eventName ?? ""}`;
    };

    const handleSlideChangeEvent = useCallback(({ currentSlideIndex, currentSlideId }) => {
        console.log("new slide index:", currentSlideIndex);
        console.log("new slide id:", currentSlideId);
        setSessionData((currentSessionData) => {
            return { ...currentSessionData, currentSlideIndex: parseInt(currentSlideIndex, 10) };
        });
    }, []);

    const handleNewQuestion = (newQuestion) => {
        console.log("newQuestion", newQuestion);
        setQuestionData((curQuestionData) => curQuestionData.concat([newQuestion]));
        if (newQuestion.user === user.username) {
            questionBoxController?.current?.scrollTo(0, 0);
        }
    };
    const handleNewChat = (newChat) => {
        console.log("newChat", newChat);
        const isSelfChat = newChat.user === user.username;
        const scrollHeight = chatBoxController?.current?.scrollHeight ?? 0;
        if (isSelfChat) {
            setNewMessageAmount(0);
            setWillScrollChatToBottom(true);
        } else if (scrollHeight === 0) {
            setNewMessageAmount((curNewMessageAmount) => {
                console.log("curNewMessageAmount", curNewMessageAmount);
                return curNewMessageAmount + 1;
            });
            if (isChatBoxAtBottom.current) {
                setWillScrollChatToBottom(true);
            }
        } else if (isChatBoxAtBottom.current) {
            setWillScrollChatToBottom(true);
        } else {
            setNewMessageAmount((curNewMessageAmount) => {
                console.log("curNewMessageAmount", curNewMessageAmount);
                return curNewMessageAmount + 1;
            });
        }
        setChatDataWithPagination((curChatDataWithPagination) =>
            curChatDataWithPagination.concat([newChat])
        );
    };
    const handleNewCommentEvent = useCallback((newComment) => {
        console.log("newComment", newComment);
        if (newComment.type === 1) {
            handleNewQuestion(newComment);
        } else {
            handleNewChat(newComment);
        }
    }, []);

    const handleUpdateAnswerEvent = useCallback((updatedComment) => {
        console.log("updatedComment", updatedComment);
        setQuestionData((curQuestionData) => {
            return curQuestionData.map((question) => {
                if (question.id === updatedComment.id) {
                    return { ...updatedComment, isUpvoted: question.isUpvoted };
                }
                return { ...question };
            });
        });
    }, []);

    const handleQuestionUpVoteEvent = useCallback((upVotedCommentInfo) => {
        console.log("upVotedCommentInfo", upVotedCommentInfo);
        setQuestionData((curQuestionData) => {
            return curQuestionData.map((question) => {
                if (question.id === upVotedCommentInfo.commentId) {
                    return {
                        ...question,
                        voteAmount: question.voteAmount + 1,
                        isUpvoted: upVotedCommentInfo.user === user.username
                    };
                }
                return { ...question };
            });
        });
    }, []);

    const handleQuestionUnVoteEvent = useCallback((unVotedCommentInfo) => {
        console.log("unVotedCommentInfo", unVotedCommentInfo);
        setQuestionData((curQuestionData) => {
            return curQuestionData.map((question) => {
                if (question.id === unVotedCommentInfo.commentId) {
                    return {
                        ...question,
                        voteAmount: question.voteAmount - 1,
                        isUpvoted: !(unVotedCommentInfo.user === user.username)
                    };
                }
                return { ...question };
            });
        });
    }, []);

    const handleEndSessionEvent = useCallback(() => {
        console.log("end this session");
        setShowEndNotifyModal(true);
    }, []);

    useEffect(() => {
        if (sessionData) {
            socket.on(getEventName("moveToSlide"), handleSlideChangeEvent);
            socket.on(getEventName("newComment"), handleNewCommentEvent);
            socket.on(getEventName("updateAnswer"), handleUpdateAnswerEvent);
            socket.on(getEventName("upvote"), handleQuestionUpVoteEvent);
            socket.on(getEventName("unvote"), handleQuestionUnVoteEvent);
            socket.on(getEventName("endSession"), handleEndSessionEvent);
        }
        return () => {
            socket?.off(getEventName("moveToSlide"), handleSlideChangeEvent);
            socket?.off(getEventName("newComment"), handleNewCommentEvent);
            socket?.off(getEventName("updateAnswer"), handleUpdateAnswerEvent);
            socket?.off(getEventName("upvote"), handleQuestionUpVoteEvent);
            socket?.off(getEventName("unvote"), handleQuestionUnVoteEvent);
            socket?.off(getEventName("endSession"), handleEndSessionEvent);
        };
    }, [
        socket,
        namespace,
        sessionData,
        handleSlideChangeEvent,
        handleNewCommentEvent,
        handleUpdateAnswerEvent,
        handleQuestionUpVoteEvent,
        handleQuestionUnVoteEvent
    ]);

    if (isGetSessionError || isGetPresentationError) {
        return (
            <p className="mt-10 text-center w-full text-neutral-400 text-3xl">
                Cannot get data for this present session.
            </p>
        );
    }

    if (!roleInThisSession) {
        return (
            <p className="mt-10 text-center w-full text-neutral-400 text-3xl">
                Only members of group can join this present session.
            </p>
        );
    }

    if (!sessionData || !presentationData) {
        return null;
    }

    return (
        <>
            <div className="relative flex flex-col w-full h-full overflow-hidden">
                <PresentationMainView
                    slideId={
                        presentationData?.slides?.[sessionData?.currentSlideIndex ?? 0]?.id ?? 0
                    }
                    nameSpace={namespace}
                    isViewer={roleInThisSession === 2}
                    setParentResultData={setResultData}
                />
                <QuestionChatBtn
                    presentationId={parseInt(presentationId, 10)}
                    chatBoxController={chatBoxController}
                    willScrollChatToBottom={willScrollChatToBottom}
                    setWillScrollChatToBottom={setWillScrollChatToBottom}
                    newMessageAmount={newMessageAmount}
                    setNewMessageAmount={setNewMessageAmount}
                    chatList={chatDataWithPagination}
                    chatPageLength={10}
                    chatTotalPage={Math.ceil(chatData.length / 10)}
                    loadMoreChat={async (curPage, curPageLength) =>
                        getListCommentByIds(curPage, curPageLength, 0)
                    }
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
                        onCloseBtnClick={() => setShowEndConfirmModal(true)}
                    />
                ) : null}
            </div>
            <ModalFrame
                width="w-[50%]"
                height="h-[80%]"
                clickOutSideToClose={false}
                isVisible={showResultModal}
                onClose={() => setShowResultModal(false)}
            >
                <PresentResultModalBody
                    presentationName={presentationData?.name ?? ""}
                    resultList={resultData}
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
                    questionBoxController={questionBoxController}
                    questionList={questionData}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    typingText={typingQuestion}
                    setTypingText={setTypingQuestion}
                />
            </ModalFrame>
            <ModalFrame
                width="max-w-[40%]"
                clickOutSideToClose={false}
                isVisible={showEndConfirmModal}
                onClose={() => setShowEndConfirmModal(false)}
            >
                <EndPresentationConfirmModalBody
                    onClose={() => setShowEndConfirmModal(false)}
                    onConfirmRemove={() => endPresentationSession()}
                />
            </ModalFrame>
            <ModalFrame
                width="w-[30%]"
                height="h-[30%]"
                clickOutSideToClose={false}
                isVisible={showEndNotifyModal}
                hasXCloseBtn={false}
                onClose={() => setShowEndNotifyModal(false)}
            >
                <EndPresentationNotifyModalBody />
            </ModalFrame>
        </>
    );
}

export default PresentationPresentPage;
