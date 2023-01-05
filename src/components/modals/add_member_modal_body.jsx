import { useContext, useState } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import { Form, Input, message } from "antd";
import AuthContext from "../contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function AddMemberModalBody({ groupId, inviteId }) {
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMess, setErrorMess] = useState(null);

    const privateAxios = usePrivateAxios();

    const inviteGroupUrl = `${window.location.origin}/group/invite/${inviteId}`;

    async function copyToClipboard(text) {
        navigator.clipboard
            .writeText(text)
            .then(() => setIsCopied(true))
            .catch((error) => console.log(error))
            .finally(() =>
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500)
            );
    }

    const onFinish = async (data) => {
        setIsLoading(true);
        console.log(data);
        privateAxios
            .get(`group/invite`, {
                params: { groupId, inviteId, sender: user.username, receiver: data.membername }
            })
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                message.open({
                    type: "success",
                    content: `Sent invite mail to user with username "${data.membername}"`
                });
            })
            .catch((error) => {
                console.log(error);
                let errorText = "Error occured. Please try again later.";
                if (
                    error.response.data.error === "User doesn't exist!" ||
                    error.response.data.error === "User has already joined group!"
                ) {
                    errorText = error.response.data.error;
                }
                setErrorMess(errorText);
                setIsLoading(false);
            });
    };
    const onFinishFailed = (error) => {
        console.log(error);
        setErrorMess(error.errorFields[0].errors);
    };

    return (
        <div className="rounded-md w-full flex flex-col">
            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
                validateTrigger="onSubmit"
                onValuesChange={() => {
                    if (errorMess) {
                        setErrorMess(null);
                    }
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <div className="relative">
                    <Form.Item
                        className="text-sm font-medium text-gray-700 mb-3"
                        label="Group link"
                        name="grouplink"
                        rules={[
                            {
                                required: true,
                                message: "Name is required.",
                                whitespace: true
                            }
                        ]}
                        initialValue={inviteGroupUrl}
                        help=""
                        validateStatus=""
                    >
                        <Input
                            readOnly
                            name="grouplink"
                            className="shadow-sm italic font-normal mt-[-4px]
                            block w-full sm:text-sm border-gray-300
                            hover:border-gray-300
                            focus:shadow-none focus:border-gray-300
                            pl-2 pr-10 py-2 bg-white border rounded-md "
                            id="grouplink"
                            type="text"
                            placeholder="ABC"
                        />
                    </Form.Item>
                    <button
                        type="button"
                        onClick={() => copyToClipboard(inviteGroupUrl)}
                        className="absolute right-0 top-6 rounded-r-md px-2 py-[9px] bg-neutral-200"
                    >
                        {isCopied ? (
                            <MdDone size={20} className="text-green-400" />
                        ) : (
                            <AiOutlineCopy size={20} />
                        )}
                    </button>
                </div>

                <Form.Item
                    className="text-sm font-medium text-gray-700 mb-1"
                    label="Member name"
                    name="membername"
                    rules={[
                        {
                            required: true,
                            message: "Name is required.",
                            whitespace: true
                        }
                    ]}
                    help=""
                    validateStatus=""
                >
                    <Input
                        id="membername"
                        className="shadow-sm mt-[-4px]
                            focus:ring-purple-600 focus:border-purple-500
                            focus:shadow-purple-300 focus:shadow-md
                            hover:border-purple-400
                            block w-full sm:text-sm border-gray-300
                            px-2 py-2 bg-white border rounded-md "
                        placeholder="ABC"
                    />
                </Form.Item>
                <p className="text-red-400 font-medium text-sm pb-1">{errorMess}</p>
                <Form.Item>
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
                                Processing...
                            </div>
                        ) : (
                            "Add member"
                        )}
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}

AddMemberModalBody.propTypes = {
    groupId: PropTypes.number.isRequired,
    inviteId: PropTypes.string.isRequired
};

export default AddMemberModalBody;
