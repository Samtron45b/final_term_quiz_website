import { Form } from "antd";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function PassswordEdit() {
    const [form] = Form.useForm();
    const [canChangePass, setCanChangePass] = useState(false);
    const [curPassError, setCurPassError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [updatePassError, setUpdatePassError] = useState(null);
    const [showCurPass, setShowCurPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

    const privateAxios = usePrivateAxios();

    if (canChangePass === null) {
        setCanChangePass(false);
    }

    function checkCurPass(curPassword) {
        setCurPassError(null);
        privateAxios
            .get(`user/checkPassword`, { params: { password: curPassword } })
            .then((response) => {
                console.log(response);
                setCanChangePass(response?.data?.isCorrect);
                if (!response?.data?.isCorrect) {
                    setCurPassError("Wrong password");
                } else setCurPassError(null);
            })
            .catch((error) => {
                console.log(error);
                setCanChangePass(false);
            });
    }
    function updatePassword(newPassword) {
        privateAxios
            .get(`user/edit`, { params: { password: newPassword } })
            .then((response) => {
                console.log(response);
                setCanChangePass(false);
                form.resetFields();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const onFinish = (data) => {
        console.log(data);
        if (data.newpassword) {
            updatePassword(data.newpassword);
        } else {
            checkCurPass(data.curpassword);
        }
    };

    function getPasswordInputClassName(isDisabled) {
        return `shadow-sm mt-[-4px]
        focus:ring-purple-600 focus:border-purple-500
        focus:shadow-purple-300 focus:shadow-md
        ${isDisabled ? "hoverborder-gray-300" : "hover:border-purple-400"} focus:outline-none
        block w-full sm:text-sm border-gray-300
        pl-2 pr-10  py-2 bg-white border rounded-md`;
    }

    function renderButton() {
        if (!canChangePass) {
            return (
                <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex justify-center py-2 px-4 border border-transparent
                    shadow-sm text-sm font-medium rounded-lg text-white bg-purple-700
                    hover:bg-purple-600"
                >
                    Check current password
                </button>
            );
        }
        return (
            <div className="flex w-1/2">
                <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex justify-center py-2 px-4 mr-2
                    shadow-sm text-md font-medium rounded-lg text-white bg-emerald-300
                    hover:bg-emerald-300/80"
                >
                    Save new password
                </button>
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex justify-center py-2 px-4
                    shadow-sm text-md font-medium rounded-lg text-white bg-gray-400
                    hover:bg-gray-300"
                    onClick={() => {
                        form.resetFields();
                        setCanChangePass(false);
                    }}
                >
                    Cancel change password
                </button>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto">
            <Form
                form={form}
                name="edit_profile_form"
                layout="vertical"
                requiredMark={false}
                validateTrigger={["onChange", "onSubmit"]}
                onValuesChange={(changedValues) => {
                    if (!changedValues.curpassword) {
                        setCurPassError(null);
                    }
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    validateTrigger="onSubmit"
                    className="text-sm font-medium text-gray-700 mb-0 pb-1"
                    label="Current password"
                    name="curpassword"
                    rules={[
                        {
                            required: true,
                            message: "Please input current password."
                        },
                        {
                            pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,}$/,
                            message: "Wrong password."
                        }
                    ]}
                >
                    <div className="relative">
                        <input
                            disabled={canChangePass}
                            id="curpassword"
                            className={getPasswordInputClassName(canChangePass)}
                            type={showCurPass ? "text" : "password"}
                            placeholder="********"
                        />
                        <div
                            className="icon_button absolute right-4 top-2"
                            onClick={() => {
                                if (!canChangePass) {
                                    setShowCurPass(!showCurPass);
                                }
                            }}
                            aria-hidden="true"
                        >
                            {showCurPass ? (
                                <FaEye className="w-5 h-5 text-purple-400" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </Form.Item>
                <p className="text-md text-red-500 font-medium py-1">{curPassError}</p>

                <Form.Item
                    className="text-sm font-medium text-gray-700 mb-3 pb-1"
                    label="New password"
                    name="newpassword"
                    rules={
                        canChangePass
                            ? [
                                  {
                                      required: true,
                                      message: "New password cannot be empty."
                                  },
                                  {
                                      pattern:
                                          /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{8,}$/,
                                      message:
                                          "Password Must Contain Atleast 8 Characters with One Uppercase, One Lowercase, One Number and One Special Case Character."
                                  }
                              ]
                            : []
                    }
                >
                    <div className="relative">
                        <input
                            disabled={!canChangePass}
                            id="newpassword"
                            className={getPasswordInputClassName(!canChangePass)}
                            type={showNewPass ? "text" : "password"}
                            placeholder="********"
                        />
                        <div
                            className="icon_button absolute right-4 top-2"
                            onClick={() => {
                                if (canChangePass) {
                                    setShowNewPass(!showNewPass);
                                }
                            }}
                            aria-hidden="true"
                        >
                            {showNewPass ? (
                                <FaEye className="w-5 h-5 text-purple-400" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </Form.Item>

                <Form.Item
                    className="text-sm font-medium text-gray-700 mb-3 pb-1"
                    label="Confirm new password"
                    name="confirm_new_password"
                    rules={
                        canChangePass
                            ? [
                                  {
                                      required: true,
                                      message: "Confirm new password is required."
                                  },
                                  ({ getFieldValue }) => ({
                                      validator(_, value) {
                                          if (!value || getFieldValue("newpassword") === value) {
                                              return Promise.resolve();
                                          }
                                          return Promise.reject(
                                              new Error(
                                                  "New password and Confirm new password must be the same."
                                              )
                                          );
                                      }
                                  })
                              ]
                            : []
                    }
                >
                    <div className="relative">
                        <input
                            disabled={!canChangePass}
                            id="confirm_new_password"
                            className={getPasswordInputClassName(!canChangePass)}
                            type={showConfirmNewPass ? "text" : "password"}
                            placeholder="********"
                        />
                        <div
                            className="icon_button absolute right-4 top-2"
                            onClick={() => {
                                if (canChangePass) {
                                    setShowConfirmNewPass(!showConfirmNewPass);
                                }
                            }}
                            aria-hidden="true"
                        >
                            {showConfirmNewPass ? (
                                <FaEye className="w-5 h-5 text-purple-400" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </Form.Item>

                <Form.Item>{renderButton()}</Form.Item>
            </Form>
        </div>
    );
}

export default PassswordEdit;
