import { Table } from "antd";
import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { ImSpinner10 } from "react-icons/im";
import { useQuery, useQueryClient } from "react-query";
import AuthContext from "../../../components/contexts/auth_context";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import { convertTimeStampToDate } from "../../../utilities";

function ChoiceResult({ presentationId }) {
    console.log(presentationId);
    const { user } = useContext(AuthContext);
    const privateAxios = usePrivateAxios();
    const queryClient = useQueryClient();

    const {
        data: presentationResultData,
        isFetching: presentationResultIsFetching,
        isError: presentationResultIsError,
        refetch: resulQueryRefetch
    } = useQuery({
        queryKey: ["get_presentation_result_data"],
        enabled: false,
        queryFn: async () => {
            return privateAxios
                .get(`presentation/answerByPresentaion?presentationId=${presentationId}`)
                .then((response) => {
                    console.log("Result data", response);
                    return (response?.data ?? []).concat([]);
                })
                .catch((error) => {
                    console.log("get result error");
                    console.log(error);
                });
        }
    });

    useEffect(() => {
        resulQueryRefetch();
        return () => {
            queryClient.removeQueries({ queryKey: ["get_presentation_result_data"], exact: true });
        };
    }, [presentationId]);

    if (presentationResultIsFetching) {
        return (
            <div className="flex h-full justify-center ">
                <ImSpinner10 size={50} className="animate-spin mr-3 mt-[10%]" />
            </div>
        );
    }

    if (!presentationResultData) {
        return null;
    }

    function getColumn() {
        const column = [
            {
                title: "User",
                dataIndex: "username",
                key: "username",
                render: (_, record) => (
                    <p className="text-lg text-gray-500 break-words">
                        {record.username === user?.username ? "me" : record.username}
                    </p>
                )
            },
            {
                title: "Chosen option",
                dataIndex: "chosenOption",
                key: "chosenOption",
                render: (_, record) => (
                    <p className="text-lg text-gray-500 break-words">{record.chosenOption}</p>
                )
            },
            {
                title: "At",
                dataIndex: "timeAnswered",
                key: "timeAnswered",
                render: (_, record) => (
                    <p className="text-lg text-gray-500 break-words">
                        {convertTimeStampToDate({
                            date: new Date(record.timeAnswered),
                            showTime: true
                        })}
                    </p>
                )
            },
            {
                title: "question",
                dataIndex: "question",
                key: "question",
                render: (_, record) => (
                    <p className="text-lg text-gray-500 break-words">
                        {convertTimeStampToDate({
                            date: new Date(record.timeAnswered),
                            showTime: true
                        })}
                    </p>
                )
            }
        ];

        return column;
    }
    function getDataSource() {
        const dataSource = [];
        const { length } = presentationResultData;
        for (let index = 0; index < length; index += 1) {
            const {
                optionId,
                optionText,
                question,
                timeAnswered,
                user: userAnswered
            } = presentationResultData[index];
            dataSource.push({
                key: `presentation_result_${optionId}`,
                id: optionId,
                username: `${userAnswered}`,
                chosenOption: `${optionText}`,
                timeAnswered,
                question
            });
        }
        return dataSource;
    }

    return (
        <div className="flex flex-col w-full min-h-full">
            {presentationResultIsError ? (
                <p className="mt-[7%] text-center text-lg font-bold text-neutral-400 break-words overflow-hidden">
                    Cannot get presentation choice result.
                </p>
            ) : (
                <Table dataSource={getDataSource()} columns={getColumn()} />
            )}
        </div>
    );
}

ChoiceResult.propTypes = {
    presentationId: PropTypes.number.isRequired
};

export default ChoiceResult;
