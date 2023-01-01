/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import { useState } from "react";
import { RiMessengerFill } from "react-icons/ri";
import ChatBox from "./chatbox";

function ChatField({
    presentationId,
    iconSize,
    chatList,
    hasMore,
    typingText,
    loadMoreChat,
    setTypingText,
    onSubmitNewChat
}) {
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
                className="text-white bg-neutral-200 font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <RiMessengerFill size={iconSize} className="text-neutral-500" />
            </button>
            <div
                hidden={!isChatBoxOpen}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="add-group-presentation-menu-button"
                tabIndex="-1"
                className="absolute top-[-500%] right-8 bottom-[75%] left-[65%] z-50 origin-top-right shadow-lg focus:outline-none"
            >
                <ChatBox
                    presentationId={presentationId}
                    chatList={chatList}
                    hasMore={hasMore}
                    typingText={typingText}
                    loadMoreChat={loadMoreChat}
                    setTypingText={setTypingText}
                    onSubmitNewChat={onSubmitNewChat}
                />
            </div>
        </>
    );
}

ChatField.propTypes = {
    presentationId: PropTypes.number,
    iconSize: PropTypes.number,
    chatList: PropTypes.array,
    hasMore: PropTypes.bool,
    typingText: PropTypes.string,
    loadMoreChat: PropTypes.func,
    setTypingText: PropTypes.func,
    onSubmitNewChat: PropTypes.func
};
ChatField.defaultProps = {
    presentationId: 0,
    iconSize: 16,
    chatList: [],
    hasMore: false,
    typingText: "",
    loadMoreChat: null,
    setTypingText: null,
    onSubmitNewChat: null
};

export default ChatField;
