import { Table, Tabs } from "antd";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { useQuery, useQueryClient } from "react-query";
import AuthContext from "../../../components/contexts/auth_context";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import { convertTimeStampToDate } from "../../../utilities";

function QuestionAndChatResult({ presentationId }) {
    console.log(presentationId);
    const { user } = useContext(AuthContext);
    const [curTabIndex, setCurTabIndex] = useState(1);
    const [chatData, setChatData] = useState([]);
    const [questionData, setQuestionData] = useState([]);

    const privateAxios = usePrivateAxios();
    const queryClient = useQueryClient();

    const {
        data: presentationQuesChatData,
        isFetching: presentationQuesChatIsFetching,
        isError: presentationQuesChatIsError,
        refetch: questionChatQueryRefetch
    } = useQuery({
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
                    return response;
                })
                .catch((error) => {
                    console.log("get comments error");
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        questionChatQueryRefetch();
        return () => {
            queryClient.removeQueries({ queryKey: ["get_presentation_comment_data"], exact: true });
        };
    }, [presentationId]);

    if (presentationQuesChatIsFetching) {
        return (
            <div className="flex h-full justify-center ">
                <ImSpinner10 size={50} className="animate-spin mr-3 mt-[10%]" />
            </div>
        );
    }

    if (!presentationQuesChatData) {
        return null;
    }

    function getQuestionColumn() {
        const column = [
            {
                title: "User",
                dataIndex: "username",
                key: "username",
                render: (_, record) => (
                    <p className="text-lg text-gray-500">
                        {record.username === user?.username ? "me" : record.username}
                    </p>
                )
            },
            {
                title: "Comment",
                dataIndex: "commentText",
                key: "commentText",
                render: (_, record) => <p className="text-lg text-gray-500">{record.commentText}</p>
            },
            {
                title: "At",
                dataIndex: "timeComment",
                key: "timeComment",
                render: (_, record) => (
                    <p className="text-lg text-gray-500">
                        {convertTimeStampToDate({
                            date: new Date(record.timeComment),
                            showTime: true
                        })}
                    </p>
                )
            },
            {
                title: "Vote amount",
                dataIndex: "voteAmount",
                key: "voteAmount",
                render: (_, record) => <p className="text-lg text-gray-500">{record.voteAmount}</p>
            },
            {
                title: "Status",
                dataIndex: "isUnAnswered",
                key: "isUnAnswered",
                render: (_, record) => (
                    <p className="text-lg text-gray-500">
                        {record.isUnAnswered ? "Un-answered" : "Answered"}
                    </p>
                )
            }
        ];

        return column;
    }

    function getChatColumn() {
        const column = [
            {
                title: "User",
                dataIndex: "username",
                key: "username",
                render: (_, record) => (
                    <p className="text-lg text-gray-500">
                        {record.username === user?.username ? "me" : record.username}
                    </p>
                )
            },
            {
                title: "Comment",
                dataIndex: "commentText",
                key: "commentText",
                render: (_, record) => <p className="text-lg text-gray-500">{record.commentText}</p>
            },
            {
                title: "At",
                dataIndex: "timeComment",
                key: "timeComment",
                render: (_, record) => (
                    <p className="text-lg text-gray-500">
                        {convertTimeStampToDate({
                            date: new Date(record.timeComment),
                            showTime: true
                        })}
                    </p>
                )
            }
        ];

        return column;
    }

    function getDataSource(isQuestion) {
        const dataList = isQuestion ? questionData : chatData;
        const dataSource = [];
        const { length } = dataList;
        for (let index = 0; index < length; index += 1) {
            const {
                id,
                user: userComment,
                commentText,
                voteAmount,
                time,
                answerText
            } = dataList[index];
            dataSource.push({
                key: `presentation_${isQuestion ? "question" : "chat"}_${id}`,
                id,
                username: `${userComment}`,
                commentText: `${commentText}`,
                voteAmount,
                timeComment: time,
                isUnAnswered: !answerText
            });
        }
        return dataSource;
    }

    return (
        <div className="flex flex-col w-full min-h-full">
            {presentationQuesChatIsError ? (
                <p className="mt-[7%] text-center text-lg font-bold text-neutral-400 break-words overflow-hidden">
                    Cannot get presentation choice result.
                </p>
            ) : (
                <Tabs
                    activeKey={`${curTabIndex}`}
                    centered
                    onChange={(activeKey) => setCurTabIndex(parseInt(activeKey, 10))}
                    items={[
                        {
                            label: `List questions`,
                            key: "1",
                            children: (
                                <Table
                                    dataSource={getDataSource(true)}
                                    columns={getQuestionColumn()}
                                    scroll={{ x: "30%" }}
                                />
                            )
                        },
                        {
                            label: `List chats`,
                            key: "2",
                            children: (
                                <Table
                                    dataSource={getDataSource(false)}
                                    columns={getChatColumn()}
                                />
                            )
                        }
                    ]}
                />
            )}
        </div>
    );
}

QuestionAndChatResult.propTypes = {
    presentationId: PropTypes.number.isRequired
};

export default QuestionAndChatResult;
