/* eslint-disable no-unused-vars */
import { Select } from "antd";
import PropTypes from "prop-types";
import { useContext } from "react";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import { convertTimeStampToDate } from "../../../utilities";
import AuthContext from "../../contexts/auth_context";
import PresenterQuestionView from "./presenter_question_view";
import ViewerQuestionView from "./viewer_question_view";

function PresentQuestionModalBody({
    isPresenter,
    presentationId,
    presentationName,
    questionList,
    sortBy,
    hasMore,
    hasMore2,
    typingText,
    loadMore,
    setSortBy,
    setTypingText
}) {
    const { user } = useContext(AuthContext);
    const privateAxios = usePrivateAxios();

    const onStatusBtnClick = (questionId, unAnswered) => {
        if (!isPresenter) return;
        privateAxios
            .get(`session/comment/anwser?commentId=${questionId}&answerText=a`)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    };

    const onVoteBtnClick = (questionId, unAnswered) => {
        if (!isPresenter) return;
        privateAxios
            .get(`session/comment/${unAnswered ? "upvote" : "unvote"}?commentId=${questionId}`)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    };

    const onSubmitQuestion = (commentText) => {
        privateAxios
            .get(`session/comment/add?`, { params: { presentationId, commentText, type: 1 } })
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    };

    const renderQuestionSenderAndTime = (sender, timeCreated) => {
        const timeString = convertTimeStampToDate({ date: new Date(timeCreated), showTime: true });
        const senderText = sender === user.username ? "YOU" : sender;
        return `By ${senderText ?? ""} at ${timeString}`;
    };

    const renderStatusBtn = (questionId, unAnswered) => {
        let questionStatusText = "Mark as answered";
        if (unAnswered && !isPresenter) {
            questionStatusText = "UnAnswered";
        } else if (!unAnswered) {
            questionStatusText = "Answered";
        }
        return (
            <button
                type="button"
                disabled={!isPresenter}
                onClick={() => {
                    onStatusBtnClick(questionId, unAnswered);
                }}
                className={`w-full px-1 py-[6px] ${
                    unAnswered ? "bg-neutral-200 text-neutral-500" : "bg-purple-500 text-white"
                } text-sm font-medium truncate ${
                    isPresenter ? "cursor-pointer rounded-lg" : "cursor-default rounded-md"
                }`}
            >
                {questionStatusText}
            </button>
        );
    };

    const renderVoteField = (voteAmount, votedByUser) => {
        if (isPresenter) {
            return (
                <div className="mt-2 flex flex-row w-full justify-center">
                    <FaRegThumbsUp size={25} className="mr-1" /> {voteAmount}
                </div>
            );
        }
        return (
            <div className="mt-2 flex flex-col w-full items-center">
                <button
                    type="button"
                    className={`flex justify-center items-center cursor-pointer w-12 h-12 rounded-full ${
                        votedByUser ? "bg-purple-500 text-white" : "bg-neutral-200 text-neutral-500"
                    }`}
                    onClick={() => onVoteBtnClick(!votedByUser)}
                >
                    <FaThumbsUp size={25} />
                </button>
                <p className="w-full text-center text-sm text-neutral-400">{voteAmount}</p>
            </div>
        );
    };

    const renderSingleQuestion = (question) => {
        return (
            <div className={`w-full flex flex-row ${isPresenter ? "p-2" : "py-3"}`}>
                <div className={`${isPresenter ? "w-[65%]" : "w-[75%]"} flex flex-col break-words`}>
                    <p className="text-sm text-neutral-300 font-medium w-full break-words">
                        {renderQuestionSenderAndTime(question.user, question.time)}
                    </p>
                    <p className="text-lg text-neutral-600 font-bold w-full break-words">
                        {question.commentText}
                    </p>
                </div>

                <div className="flex-1" />

                <div
                    className={`${
                        isPresenter ? "w-[30%]" : "w-[20%] mr-2"
                    } flex flex-col break-words`}
                >
                    {renderStatusBtn(question.id, question.answerText === "")}
                    {renderVoteField(question.vote, true)}
                </div>
            </div>
        );
    };

    const renderQuestionList = () => {
        let unAnsweredList;
        let answeredList;
        let questionListToRender = questionList.concat([]);
        if (sortBy === 0) {
            questionListToRender.sort((question1, question2) => question2.time - question1.time);
        } else if (sortBy === 1) {
            questionListToRender.sort((question1, question2) => question2.vote - question1.vote);
        }
        if (isPresenter || sortBy === 2 || sortBy === 3) {
            unAnsweredList = questionListToRender.filter((question) => {
                return question.answerText === "";
            });
            answeredList = questionListToRender.filter((question) => {
                return question.answerText !== "";
            });
            if (sortBy === 2) {
                questionListToRender = unAnsweredList.concat(answeredList);
            } else if (sortBy === 3) {
                questionListToRender = answeredList.concat(unAnsweredList);
            }
        }
        if (isPresenter) {
            return (
                <PresenterQuestionView
                    unAnsweredQuestionList={unAnsweredList}
                    answeredQuestionList={answeredList}
                    hasMoreUnAnswered={hasMore}
                    hasMoreAnswered={hasMore2}
                    loadMoreQuestion={loadMore}
                    renderSingleQuestion={renderSingleQuestion}
                />
            );
        }
        return (
            <ViewerQuestionView
                questionList={questionListToRender}
                hasMore={hasMore}
                typingText={typingText}
                loadMoreQuestion={loadMore}
                renderSingleQuestion={renderSingleQuestion}
                setTypingText={setTypingText}
            />
        );
    };

    return (
        <div className="px-2 w-full h-full overflow-hidden">
            <p className="mb-2 w-full text-lg font-bold text-neutral-500 truncate">
                QuestionQnA for presentation {presentationName}
            </p>
            <div className="flex flex-row w-full py-1 gap-x-2 items-center">
                <p className="text-md text-neutral-500">Sort by:</p>
                <Select
                    size="default"
                    placeholder="sort's type"
                    className="w-[20%]"
                    defaultValue={sortBy}
                    onSelect={(value, option) => {
                        console.log("selected sort by", value, option);
                        setSortBy(value);
                    }}
                >
                    <Select.Option value={0}>Time</Select.Option>
                    <Select.Option value={1}>Vote</Select.Option>
                    {!isPresenter ? (
                        <>
                            <Select.Option value={2}>Un-answered</Select.Option>
                            <Select.Option value={3}>Answered</Select.Option>
                        </>
                    ) : null}
                </Select>
            </div>
            {renderQuestionList()}
        </div>
    );
}

PresentQuestionModalBody.propTypes = {
    isPresenter: PropTypes.bool,
    presentationId: PropTypes.number.isRequired,
    presentationName: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    questionList: PropTypes.array,
    sortBy: PropTypes.number,
    hasMore: PropTypes.bool,
    hasMore2: PropTypes.bool,
    typingText: PropTypes.string,
    loadMore: PropTypes.func,
    setSortBy: PropTypes.func,
    setTypingText: PropTypes.func
};
PresentQuestionModalBody.defaultProps = {
    isPresenter: false,
    presentationName: "",
    questionList: [],
    sortBy: 0,
    hasMore: false,
    hasMore2: false,
    typingText: "",
    loadMore: null,
    setSortBy: null,
    setTypingText: null
};

export default PresentQuestionModalBody;
