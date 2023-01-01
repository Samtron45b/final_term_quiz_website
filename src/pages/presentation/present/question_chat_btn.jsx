import PropTypes from "prop-types";
import { RiQuestionnaireFill } from "react-icons/ri";
import ChatField from "./chat_field";

function QuestionChatBtn({
    presentationId,
    chatList,
    hasMoreChat,
    typingText,
    loadMoreChat,
    setTypingText,
    onSubmitNewChat,
    onQuestionBtnClick
}) {
    const iconSize = 20;
    return (
        <div
            id="question_chat_btn"
            className="fixed inset-x-0 bottom-0 z-30 p-8 bg-transparent flex flex-row justify-end items-center gap-x-2"
        >
            <button
                type="button"
                onClick={() => onQuestionBtnClick()}
                className="text-white bg-neutral-200 font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <RiQuestionnaireFill size={iconSize} className="text-neutral-500" />
            </button>
            <ChatField
                presentationId={presentationId}
                iconSize={iconSize}
                chatList={chatList}
                hasMoreChat={hasMoreChat}
                typingText={typingText}
                loadMoreChat={loadMoreChat}
                setTypingText={setTypingText}
                onSubmitNewChat={onSubmitNewChat}
            />
        </div>
    );
}

QuestionChatBtn.propTypes = {
    presentationId: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    chatList: PropTypes.array,
    hasMoreChat: PropTypes.bool,
    typingText: PropTypes.string,
    loadMoreChat: PropTypes.func,
    setTypingText: PropTypes.func,
    onSubmitNewChat: PropTypes.func,
    onQuestionBtnClick: PropTypes.func
};
QuestionChatBtn.defaultProps = {
    presentationId: 0,
    chatList: [],
    hasMoreChat: false,
    typingText: "",
    loadMoreChat: null,
    setTypingText: null,
    onSubmitNewChat: null,
    onQuestionBtnClick: null
};

export default QuestionChatBtn;
