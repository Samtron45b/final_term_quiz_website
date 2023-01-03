/* eslint-disable no-unused-vars */
import { Form, Radio, Space } from "antd";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import AuthContext from "../contexts/auth_context";

function StartPresentModalBody({ presentationToPresent }) {
    const { user } = useContext(AuthContext);
    const [presentOption, setPresentOption] = useState("public");
    const [presentError, setPresentError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const privateAxios = usePrivateAxios();
    const {
        isFetching: isJoinedGroupFetching,
        data: joinedGroupListQueryRes,
        refetch: joinedGroupListQueryRefetch
    } = useQuery({
        queryKey: ["get_joined_group_list"],
        enabled: false,
        queryFn: async () => {
            console.log("run joined by");
            return privateAxios
                .get(`group/joinedBy`)
                .then((response) => {
                    console.log("joined groups", response);
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    const onFinish = async (data) => {
        console.log(data);
        setIsLoading(true);
        privateAxios
            .get(`/session/presentation/start/${data.present_option}?`, {
                params: {
                    presentationId: presentationToPresent.presentationId,
                    groupId: data.present_group_id
                }
            })
            .then((response) => {
                console.log("start presentation response", response);
                navigate(
                    `../presentation/${presentationToPresent.presentationId}/present/${
                        response?.data?.sessionId ?? 0
                    }`
                );
                return response;
            })
            .catch((error) => {
                console.log(error);
                setPresentError(error.response.data.error);
            })
            .finally(() => setIsLoading(false));
    };
    const onFinishFailed = (error) => {
        console.log(error);
        setPresentError(error.errorFields[0].errors[0]);
    };

    const getGroupName = (group) => {
        let groupName = group.name;
        if (group.creator.username !== user.username) {
            groupName = `${groupName} (owner: ${group.creator.displayname}-${group.creator.username})`;
        }
        return groupName;
    };

    const renderGroupListOption = () => {
        if (presentOption === "public") return null;
        if (isJoinedGroupFetching) {
            return (
                <div className="flex w-full h-full justify-center items-center">
                    <ImSpinner10 size={25} className="animate-spin" />
                </div>
            );
        }
        const listToRender = (joinedGroupListQueryRes?.data ?? []).concat([]);
        return (
            <div className="w-full h-full px-2 py-2 border-2 rounded-sm mb-0 overflow-x-hidden overflow-y-auto">
                <Form.Item
                    className="text-sm font-medium text-gray-700 mb-0"
                    name="present_group_id"
                    rules={[
                        {
                            required: true,
                            message: "Please choose a group to present."
                        }
                    ]}
                    help=""
                    validateStatus=""
                >
                    <Radio.Group className="w-full">
                        <Space direction="vertical" className="w-full">
                            {listToRender.map((group) => {
                                return (
                                    <div
                                        key={group.id}
                                        className="px-3 py-3 w-full text-lg text-neutral-400 font-medium"
                                    >
                                        <Radio
                                            value={group.id}
                                            className="w-full overflow-hidden break-all"
                                        >
                                            {getGroupName(group)}
                                        </Radio>
                                    </div>
                                );
                            })}
                        </Space>
                    </Radio.Group>
                </Form.Item>
            </div>
        );
    };

    useEffect(() => {
        setPresentError(null);
        if (presentOption === "group") {
            joinedGroupListQueryRefetch();
        }
    }, [presentOption]);

    return (
        <div className="rounded-md w-full max-h-full overflow-hidden">
            <h2 className="mb-2 text-lg font-bold">
                Where do you want do present presentation {presentationToPresent?.presentationName}?
            </h2>
            <Form
                form={form}
                name="register_form"
                initialValues={{
                    present_option: "public"
                }}
                onValuesChange={(changedValues) => {
                    console.log(changedValues);
                    setPresentError(null);
                    if (changedValues.present_option !== undefined) {
                        setPresentOption(changedValues.present_option);
                    }
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item className="mb-2" name="present_option" label="">
                    <Radio.Group className="w-full">
                        <Space direction="vertical" className="w-full">
                            <Radio value="public">Public</Radio>
                            <Radio value="group">Group</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
                {renderGroupListOption()}
                <p className="text-red-400 mb-2 pt-1">{presentError}</p>
                <Form.Item className="mb-2">
                    <button
                        type="submit"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        className="inline-flex float-right justify-center py-2 px-4 border border-transparent
                            shadow-sm text-sm font-medium rounded-md text-white bg-purple-700
                            hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                                Starting...
                            </div>
                        ) : (
                            "Present"
                        )}
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}

StartPresentModalBody.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    presentationToPresent: PropTypes.object
};
StartPresentModalBody.defaultProps = {
    presentationToPresent: null
};

export default StartPresentModalBody;
