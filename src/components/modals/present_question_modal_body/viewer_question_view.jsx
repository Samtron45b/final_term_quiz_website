/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
import { Form } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { IoSend } from "react-icons/io5";
import InfiniteScroll from "../../infinite_scroll";

function ViewerQuestionView({
    questionBoxController,
    questionList,
    renderSingleQuestion,
    hasMore,
    typingText,
    loadMoreQuestion,
    setTypingText,
    onSubmitNewQuestion
}) {
    const [form] = Form.useForm();
    const fieldName = "newQuestion";

    const onFinish = (data) => {
        console.log(data);
        if (data[fieldName] === "") return;
        onSubmitNewQuestion?.(data[fieldName]);
        form.setFieldValue(fieldName, "");
    };

    useEffect(() => {
        form.setFieldValue(fieldName, typingText ?? "");
        return () => {
            setTypingText?.(form.getFieldValue(fieldName));
        };
    }, []);

    const renderQuestionList = () => {
        return (
            <div className="mt-2 w-full h-[70%] overflow-hidden">
                <InfiniteScroll
                    controllerRef={questionBoxController}
                    dataSource={questionList}
                    itemRender={(question) => {
                        return renderSingleQuestion(question);
                    }}
                    dividerRender={<div className="w-full h-[2px] bg-neutral-500" />}
                    hasMore={hasMore}
                    loadMore={loadMoreQuestion}
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
            {renderQuestionList()}
            <div className="w-full mt-3 mb-1 h-[1.5px] bg-neutral-400" />
            <Form
                form={form}
                layout="horizontal"
                className="w-full h-[15%] flex flex-row"
                onFinish={onFinish}
            >
                <Form.Item
                    className="w-[95%] text-sm font-medium text-gray-700 mb-0 mt-2 mr-2"
                    name={fieldName}
                    help=""
                    validateStatus=""
                >
                    <input
                        id={fieldName}
                        name={fieldName}
                        className="shadow-sm
                            focus:ring-purple-600 focus:border-purple-500
                            focus:shadow-purple-300
                            focus:shadow-inner
                            focus:outline-none hover:border-purple-400
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

ViewerQuestionView.propTypes = {
    questionBoxController: PropTypes.any,
    questionList: PropTypes.array,
    renderSingleQuestion: PropTypes.func,
    hasMore: PropTypes.bool,
    typingText: PropTypes.string,
    loadMoreQuestion: PropTypes.func,
    setTypingText: PropTypes.func,
    onSubmitNewQuestion: PropTypes.func
};
ViewerQuestionView.defaultProps = {
    questionBoxController: null,
    questionList: [],
    renderSingleQuestion: null,
    hasMore: false,
    typingText: "",
    loadMoreQuestion: null,
    setTypingText: null,
    onSubmitNewQuestion: null
};

export default ViewerQuestionView;
