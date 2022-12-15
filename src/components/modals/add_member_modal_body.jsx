import { useContext, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import AuthContext from "../contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function AddMemberModalBody({ groupName, inviteId }) {
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMess, setErrorMess] = useState(null);

    const privateAxios = usePrivateAxios();

    const onFinish = async (data) => {
        setIsLoading(true);
        console.log(data);
        privateAxios
            .get(
                `group/invite?groupname=${groupName}&inviteId=${inviteId}&sender=${user.username}&receiver=${data.membername}`
            )
            .then((response) => {
                console.log(response);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setErrorMess(error.response.data.error);
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
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
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
                    initialValue={`http://localhost:3000/invite/${inviteId}`}
                    help=""
                    validateStatus=""
                >
                    <input
                        disabled
                        name="grouplink"
                        className="shadow-sm italic font-normal mt-[-4px]
                            focus:ring-indigo-500 focus:border-indigo-500
                            block w-full sm:text-sm border-gray-300
                            px-2 py-2 bg-white border rounded-md "
                        id="grouplink"
                        type="text"
                        placeholder="ABC"
                    />
                </Form.Item>

                <Form.Item
                    className="text-sm font-medium text-gray-700 mb-1"
                    label="Member name"
                    name="name"
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
                <p className="text-red-400 font-medium text-sm mb-3">{errorMess}</p>
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
    groupName: PropTypes.string.isRequired,
    inviteId: PropTypes.string.isRequired
};

export default AddMemberModalBody;
