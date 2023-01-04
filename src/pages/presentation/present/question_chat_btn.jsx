/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import { RiQuestionnaireFill } from "react-icons/ri";
import ChatField from "./chat_field";

function QuestionChatBtn({
    presentationId,
    chatBoxController,
    willScrollChatToBottom,
    setWillScrollChatToBottom,
    newMessageAmount,
    setNewMessageAmount,
    chatList,
    chatPageLength,
    chatTotalPage,
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
                chatBoxController={chatBoxController}
                willScrollChatToBottom={willScrollChatToBottom}
                setWillScrollChatToBottom={setWillScrollChatToBottom}
                newMessageAmount={newMessageAmount}
                setNewMessageAmount={setNewMessageAmount}
                iconSize={iconSize}
                chatList={chatList}
                chatPageLength={chatPageLength}
                chatTotalPage={chatTotalPage}
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
    chatBoxController: PropTypes.any,
    willScrollChatToBottom: PropTypes.bool,
    newMessageAmount: PropTypes.number,
    chatList: PropTypes.array,
    chatPageLength: PropTypes.number,
    chatTotalPage: PropTypes.number,
    typingText: PropTypes.string,
    loadMoreChat: PropTypes.func,
    setTypingText: PropTypes.func,
    onSubmitNewChat: PropTypes.func,
    setWillScrollChatToBottom: PropTypes.func,
    setNewMessageAmount: PropTypes.func,
    onQuestionBtnClick: PropTypes.func
};
QuestionChatBtn.defaultProps = {
    presentationId: 0,
    chatBoxController: null,
    willScrollChatToBottom: false,
    newMessageAmount: 0,
    chatList: [],
    chatPageLength: 10,
    chatTotalPage: 1,
    typingText: "",
    loadMoreChat: null,
    setTypingText: null,
    onSubmitNewChat: null,
    setWillScrollChatToBottom: null,
    setNewMessageAmount: null,
    onQuestionBtnClick: null
};

export default QuestionChatBtn;
