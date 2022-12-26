import { useContext, useState } from "react";
// import { AiOutlineCopy } from "react-icons/ai";
// import { MdDone } from "react-icons/md";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import { Form, Input, message } from "antd";
import AuthContext from "../../contexts/auth_context";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";

function AddCollaboratorForm({ presentationId, inviteId }) {
    const { user } = useContext(AuthContext);
    console.log(user, presentationId);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMess, setErrorMess] = useState(null);

    const privateAxios = usePrivateAxios();

    const onFinish = async (data) => {
        setIsLoading(true);
        console.log(data);
        privateAxios
            .get(`presentation/invite`, {
                params: {
                    presentationId,
                    inviteId,
                    sender: user.username,
                    receiver: data.newCollaboratorName
                }
            })
            .then((response) => {
                console.log(response);
                message.open({
                    type: "success",
                    content: `Sent invite mail to user with username "${data.newCollaboratorName}"`
                });
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setErrorMess(error.response.data.error);
                setIsLoading(false);
            });
        // privateAxios
        //     .get(`presentation/addCollaborator`, {
        //         params: {
        //             inviteId: "e95113ea-f58c-4f20-811e-f0e3fe6fdaae",
        //             username: data.newCollaboratorName
        //         }
        //     })
        //     .then((response) => {
        //         console.log(response);
        //         setIsLoading(false);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         setErrorMess(error.response.data.error);
        //         setIsLoading(false);
        //     });
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
                <Form.Item
                    className="text-md font-medium text-gray-700 mb-1"
                    label="New collaborator's name"
                    name="newCollaboratorName"
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
                        id="newCollaboratorName"
                        className="mt-[-4px]
                            focus:ring-purple-600 focus:border-purple-500
                            focus:shadow-purple-300 focus:shadow-inner
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
                            "Add collaborator"
                        )}
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}

AddCollaboratorForm.propTypes = {
    inviteId: PropTypes.string,
    presentationId: PropTypes.number.isRequired
};
AddCollaboratorForm.defaultProps = {
    inviteId: ""
};

export default AddCollaboratorForm;
