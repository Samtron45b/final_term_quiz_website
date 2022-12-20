import { useContext, useState, useEffect } from "react";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import AuthContext from "../contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function AddGroupPresentationModalBody({ addingType, setShowModal, params }) {
    console.log(params);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [errorMess, setErrorMess] = useState(null);
    const [service, setService] = useState("");
    const navigate = useNavigate();
    const privateAxios = usePrivateAxios();

    useEffect(() => {
        if (addingType === 1) {
            setService("group");
        } else {
            setService("presentation");
        }
    }, [addingType]);

    const onFinish = async (data) => {
        setIsLoading(true);
        console.log(data);
        const url =
            addingType === 1
                ? `group/create?username=${user.username}&groupname=${data.name}`
                : `presentation/create?presentationName=${data.name}`;
        console.log(url);
        privateAxios
            .get(url)
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                setShowModal(0);
                if (addingType === 1) {
                    navigate(`/group_detail/${response?.data?.lastId ?? 0}`);
                } else {
                    navigate(`/presentation/${response?.data?.presentationId ?? 0}/edit`);
                }
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
                layout="vertical"
                requiredMark="optional"
                validateTrigger="onSubmit"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    className="text-sm font-medium text-gray-700 mb-1"
                    label={`${addingType === 1 ? "Group" : "Presentation"} name`}
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
                        id="name"
                        className="shadow-sm
                                focus:ring-purple-600 focus:border-purple-500
                                focus:shadow-purple-300 focus:shadow-md
                                hover:border-purple-400
                                block w-full sm:text-sm border-gray-300
                                px-2 py-2 bg-white border rounded-md "
                        placeholder="ABC"
                    />
                </Form.Item>
                <p className="text-red-400 text-sm">{errorMess}</p>
                <Form.Item>
                    <button
                        type="submit"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        className="inline-flex mt-1 float-right justify-center py-2 px-4 border border-transparent
                        shadow-sm text-sm font-medium rounded-md text-white bg-purple-700
                        hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                                Adding {service}...
                            </div>
                        ) : (
                            `Add ${service}`
                        )}
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}

AddGroupPresentationModalBody.propTypes = {
    addingType: PropTypes.number,
    setShowModal: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object
};
AddGroupPresentationModalBody.defaultProps = {
    addingType: 0,
    setShowModal: null,
    params: null
};

export default AddGroupPresentationModalBody;
