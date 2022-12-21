import { Form, Input } from "antd";
import { useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import { publicAxios } from "../../configs/networks/custom_axioses";

function ForgotPassPage() {
    const [resetPassStatus, setResetPassStatus] = useState(-1);
    const [forgotPassError, setForgotPassError] = useState(null);
    const [username, setUsername] = useState(null);
    // const navigate = useNavigate();
    // const location = useLocation();

    const onFinish = async (data) => {
        setResetPassStatus(0);
        console.log("username:", username);
        console.log(data);
        publicAxios
            .get(`auth/resetPass?username=${username}`)
            .then(async (response) => {
                console.log(response);
                const { accessToken } = response.data;
                localStorage.setItem("accessToken", accessToken);
                // navigate(location.state?.from ?? "/", { replace: true });
                setForgotPassError(null);
            })
            .catch((loginErr) => {
                console.log(loginErr.response);
            })
            .finally(() => {
                setResetPassStatus(1);
            });
    };

    const onFinishFailed = (error) => {
        console.log(error);
        setForgotPassError(error.errorFields[0].errors);
    };

    function renderBeforeChangedChild() {
        if (resetPassStatus < 1) {
            return (
                <>
                    <Form.Item
                        className="text-sm font-medium text-gray-700 mb-0"
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Username is required",
                                whitespace: true
                            }
                        ]}
                        help=""
                        validateStatus=""
                    >
                        <Input
                            disabled={resetPassStatus !== -1}
                            id="username"
                            className="shadow-sm mt-[-4px]
                                focus:ring-purple-600 focus:border-purple-500
                                focus:shadow-purple-300 focus:shadow-md
                                hover:border-purple-400
                                block w-full sm:text-sm border-gray-300
                                px-2 py-2 bg-white border rounded-md "
                            placeholder="Quamon"
                        />
                    </Form.Item>
                    <Form.Item>
                        <>
                            <p className="text-red-600 text-md pt-[2px]">{forgotPassError}</p>
                            <div className="mt-2">
                                <button
                                    disabled={resetPassStatus === 0}
                                    type="submit"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="w-full px-4 py-2 tracking-wide text-white font-medium text-lg transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                                >
                                    {resetPassStatus === 0 ? (
                                        <div className="flex justify-center items-center">
                                            <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                                            Resetting password
                                        </div>
                                    ) : (
                                        "Reset password"
                                    )}
                                </button>
                            </div>
                        </>
                    </Form.Item>
                </>
            );
        }
        return null;
    }

    function renderAfterChangedChild() {
        if (resetPassStatus < 1) {
            return null;
        }
        return (
            <p>
                We have sent a new password through the email linked to account
                {`${username ? ` ${username}` : ""}`}&#46; If you don&#39;t see any password mail,
                please in the spam box or click{" "}
                <span
                    className="hover:underline hover:decoration-2 font-bold text-purple-500 cursor-pointer"
                    onClick={() => onFinish()}
                    aria-hidden
                >
                    resend
                </span>
            </p>
        );
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full md:max-w-xl bg-white shadow-lg rounded px-8 pt-8 pb-6">
                <h1 className="text-3xl font-semibold text-center text-purple-700 uppercase mb-2">
                    Forgot password
                </h1>
                <Form
                    name="forgot_pass_form"
                    layout="vertical"
                    requiredMark="optional"
                    onValuesChange={(changedValues) => {
                        setUsername(changedValues.username);
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    {renderBeforeChangedChild()}
                    {renderAfterChangedChild()}
                </Form>
            </div>
        </div>
    );
}

export default ForgotPassPage;
