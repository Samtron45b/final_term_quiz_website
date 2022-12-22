import { Form } from "antd";
import { useContext, useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import AuthContext from "../contexts/auth_context";

function ProfileViewEdit() {
    const { user, setUser } = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editProfileError, setProfileEditError] = useState(null);
    const [form] = Form.useForm();
    const privateAxios = usePrivateAxios();

    function resetProfileEditField(data) {
        form.setFieldsValue({
            username: user.username,
            email: data?.email ?? user.email,
            displayName: data?.displayName ?? user.displayName
        });
    }

    const onFinish = async (data) => {
        console.log(data);
        setLoading(true);
        privateAxios
            .get(`user/edit`, {
                params: {
                    username: user.username,
                    displayName: data.displayName,
                    email: data.email
                }
            })
            .then(async (response) => {
                console.log(response);
                console.log(user);
                const newUser = {
                    ...user,
                    displayName: data.displayName,
                    email: data.email
                };
                setUser({ ...newUser });
                localStorage.setItem("userData", JSON.stringify(newUser));
                resetProfileEditField(data);
                setIsEditing(false);
            })
            .catch((error) => {
                console.log(error);
                setProfileEditError("Update profile failed.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    function getInputClassName(isDisabled) {
        return `shadow-sm mt-[-4px]
        focus:outline-none focus:border-purple-500
        focus:shadow-purple-300 focus:shadow-md
        ${isDisabled ? "hover:border-gray-300" : "hover:border-purple-400"}
        block w-full sm:text-sm border-gray-300
        px-2 py-2 bg-white border rounded-md `;
    }

    function renderButton() {
        if (isLoading || !isEditing) {
            return (
                <button
                    disabled={isLoading}
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className={`inline-flex mt-1 justify-center py-2 px-4 border border-transparent
                    shadow-sm text-sm font-medium rounded-lg text-white ${
                        isLoading ? "bg-neutral-500" : "bg-purple-700"
                    }
                    ${isLoading ? "hover:bg-neutral-500" : "hover:bg-purple-600"}`}
                    onClick={() => setIsEditing(true)}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                            Saving changes...
                        </div>
                    ) : (
                        "Edit profile"
                    )}
                </button>
            );
        }
        return (
            <div className="flex w-1/2 mt-1">
                <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex justify-center py-2 px-4 mr-2
                    shadow-sm text-md font-medium rounded-lg text-white bg-emerald-300
                    hover:bg-emerald-300/80"
                >
                    Save changes
                </button>
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex justify-center py-2 px-4
                    shadow-sm text-md font-medium rounded-lg text-white bg-gray-400
                    hover:bg-gray-300"
                    onClick={() => {
                        resetProfileEditField();
                        setProfileEditError(null);
                        setIsEditing(false);
                    }}
                >
                    Cancel edit
                </button>
            </div>
        );
    }

    useEffect(() => {
        resetProfileEditField();
    }, []);

    return (
        <div className="">
            <Form
                form={form}
                name="edit_profile_form"
                layout="vertical"
                requiredMark="optional"
                validateTrigger="onChange"
                onFinish={onFinish}
            >
                <Form.Item
                    initialValue=""
                    className="text-sm font-medium text-gray-700 mb-3 pb-1"
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true
                        }
                    ]}
                >
                    <input
                        disabled
                        name="username"
                        className={getInputClassName(true)}
                        id="username"
                        type="text"
                    />
                </Form.Item>
                <Form.Item
                    initialValue=""
                    className="text-sm font-medium text-gray-700 mb-4 pb-1"
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Email cannot be empty.",
                            whitespace: true
                        },
                        {
                            pattern:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Invalid email."
                        }
                    ]}
                >
                    <input
                        disabled={!isEditing}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        className={getInputClassName(!isEditing)}
                    />
                </Form.Item>
                <Form.Item
                    initialValue=""
                    className="text-sm font-medium text-gray-700 mb-4 pb-1"
                    label="Display name"
                    name="displayName"
                    rules={[
                        {
                            required: true,
                            message: "Display name cannot be empty",
                            whitespace: true
                        }
                    ]}
                >
                    <input
                        name="displayName"
                        className={getInputClassName(!isEditing)}
                        disabled={!isEditing}
                        id="displayName"
                        type="text"
                        placeholder="Quamon"
                    />
                </Form.Item>
                <p className="text-red-600">{editProfileError}</p>
                <Form.Item>{renderButton()}</Form.Item>
            </Form>
        </div>
    );
}

export default ProfileViewEdit;
