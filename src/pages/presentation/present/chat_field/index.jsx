/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { RiMessengerFill } from "react-icons/ri";
import ChatBox from "./chatbox";

function ChatField({
    presentationId,
    chatBoxController,
    willScrollChatToBottom,
    setWillScrollChatToBottom,
    newMessageAmount,
    iconSize,
    chatList,
    hasMore,
    typingText,
    loadMoreChat,
    setTypingText,
    onSubmitNewChat
}) {
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(true);

    useEffect(() => {
        if (willScrollChatToBottom) {
            chatBoxController.current?.scrollTo({
                left: 0,
                top: chatBoxController.current?.scrollheight
            });
            setWillScrollChatToBottom(false);
        }
    }, [chatList]);

    return (
        <>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => {
                        console.log(chatBoxController.current.clientHeight);
                        console.log(chatBoxController.current.offsetHeight);
                        console.log(chatBoxController.current.scrollTop);
                        setIsChatBoxOpen(!isChatBoxOpen);
                    }}
                    className="text-white bg-neutral-200 font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
                >
                    <RiMessengerFill size={iconSize} className="text-neutral-500" />
                </button>
                <div
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="add-group-presentation-menu-button"
                    tabIndex="-1"
                    className={`absolute ${
                        isChatBoxOpen || newMessageAmount === 0 ? "hidden" : "flex"
                    } w-5 h-5 right-[-4px] bottom-[60%] justify-center items-center rounded-full text-[7px] text-white text-center bg-purple-500`}
                >
                    {newMessageAmount <= 9 ? newMessageAmount : `9+`}
                </div>
            </div>
            <div
                hidden={!isChatBoxOpen}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="add-group-presentation-menu-button"
                tabIndex="-1"
                className="absolute top-[-520%] right-8 bottom-[75%] left-[65%] z-50 origin-top-right rounded-lg bg-white shadow-lg shadow-purple-300 focus:outline-none"
            >
                <ChatBox
                    presentationId={presentationId}
                    chatBoxController={chatBoxController}
                    newMessageAmount={newMessageAmount}
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
    chatBoxController: PropTypes.any,
    willScrollChatToBottom: PropTypes.bool,
    newMessageAmount: PropTypes.number,
    iconSize: PropTypes.number,
    chatList: PropTypes.array,
    hasMore: PropTypes.bool,
    typingText: PropTypes.string,
    loadMoreChat: PropTypes.func,
    setTypingText: PropTypes.func,
    onSubmitNewChat: PropTypes.func,
    setWillScrollChatToBottom: PropTypes.func
};
ChatField.defaultProps = {
    presentationId: 0,
    chatBoxController: null,
    willScrollChatToBottom: false,
    newMessageAmount: 0,
    iconSize: 16,
    chatList: [],
    hasMore: false,
    typingText: "",
    loadMoreChat: null,
    setTypingText: null,
    onSubmitNewChat: null,
    setWillScrollChatToBottom: null
};

export default ChatField;
