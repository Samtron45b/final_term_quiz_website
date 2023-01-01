/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
import { Form, Input } from "antd";
import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import AuthContext from "../../../../components/contexts/auth_context";
import InfiniteScroll from "../../../../components/infinite_scroll";
import usePrivateAxios from "../../../../configs/networks/usePrivateAxios";
import { convertTimeStampToDate } from "../../../../utilities";

function ChatBox({ presentationId, chatList, hasMore, typingText, loadMoreChat, setTypingText }) {
    const { user } = useContext(AuthContext);
    const privateAxios = usePrivateAxios();
    const [form] = Form.useForm();
    const fieldName = "newChat";

    const onSubmitNewChat = (commentText) => {
        privateAxios
            .get(`session/comment/add?`, { params: { presentationId, commentText, type: 0 } })
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    };

    const onFinish = (data) => {
        console.log(data);
        if (data[fieldName] === "") return;
        onSubmitNewChat?.(data[fieldName]);
    };

    useEffect(() => {
        form.setFieldValue(fieldName, typingText);
        return () => {
            setTypingText?.(form.getFieldValue(fieldName));
        };
    }, []);

    const renderQuestionSenderAndTime = (sender, timeCreated) => {
        const timeString = convertTimeStampToDate({ date: new Date(timeCreated), showTime: true });
        const senderText = sender === user.username ? "YOU" : sender;
        return `By ${senderText ?? ""} at ${timeString}`;
    };

    const renderSingleChatItem = (chatItem) => {
        const isSeflChat = user.username === chatItem.user;
        return (
            <div
                className={`w-full p-2 flex flex-row ${
                    isSeflChat ? "justify-end" : "justify-start"
                }`}
            >
                <div className="w-[80%] flex flex-col break-words">
                    <p className="text-sm text-neutral-300 w-full break-words">
                        {renderQuestionSenderAndTime(chatItem.user, chatItem.time)}
                    </p>
                    <p
                        className={`px-2 py-1 mt-1 text-md w-full break-words rounded-xl ${
                            isSeflChat
                                ? "text-white bg-purple-500"
                                : "text-neutral-600 bg-neutral-300"
                        }`}
                    >
                        {chatItem.commentText}
                    </p>
                </div>
            </div>
        );
    };

    const renderchatList = () => {
        return (
            <div className="mt-2 w-full h-[87%] overflow-hidden">
                <InfiniteScroll
                    dataSource={chatList}
                    itemRender={(question) => {
                        return renderSingleChatItem(question);
                    }}
                    dividerRender={<div className="w-full h-[2px] bg-neutral-500" />}
                    hasMore={hasMore}
                    loadMore={loadMoreChat}
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full">
            <style>{`
                .ant-form-inline .ant-form-item {
                    margin-right: 0px;
                }
            `}</style>
            {renderchatList()}
            <div className="w-full mb-1 h-[1px] bg-neutral-400" />
            <Form
                form={form}
                layout="horizontal"
                className="w-full h-[10%] flex flex-row"
                onFinish={onFinish}
            >
                <Form.Item
                    className="w-[95%] text-sm font-medium text-gray-700 mb-0 mt-2 mr-2"
                    name="newQuestion"
                    help=""
                    validateStatus=""
                >
                    <Input
                        id="newQuestion"
                        className="shadow-sm
                                focus:ring-purple-600 focus:border-purple-500
                                focus:shadow-purple-300 focus:shadow-md
                                hover:border-purple-400
                                block w-full sm:text-sm border-gray-300
                                px-2 py-2 bg-white border rounded-md "
                        placeholder="Type and send what you want to ask"
                    />
                </Form.Item>
                <Form.Item
                    className="flex-1 text-sm font-medium text-gray-700 mb-0"
                    name="newQuestion"
                    help=""
                    validateStatus=""
                >
                    <button
                        type="submit"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        className="pl-6 pr-5 py-2 flex  mt-[10px] border-0 border-transparent
                        shadow-sm text-sm font-medium rounded-md text-white bg-purple-600
                        hover:bg-purple-400 focus:outline-none focus:bg-purple-700"
                    >
                        <IoSend size={20} />
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}

ChatBox.propTypes = {
    presentationId: PropTypes.number,
    chatList: PropTypes.array,
    hasMore: PropTypes.bool,
    typingText: PropTypes.string,
    loadMoreChat: PropTypes.func,
    setTypingText: PropTypes.func
};
ChatBox.defaultProps = {
    presentationId: 0,
    chatList: [],
    hasMore: false,
    typingText: "",
    loadMoreChat: null,
    setTypingText: null
};

export default ChatBox;
