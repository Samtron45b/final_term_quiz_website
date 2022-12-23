import React, { useState } from "react";
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";
import { Form, Radio, Space } from "antd";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function ChangeMemberRoleModalBody({
    groupId,
    memberRole,
    memberName,
    memberDisplayName,
    afterMemberRoleChanged
}) {
    const [form] = Form.useForm();
    const [memSelectedRole, setMemSelectedRole] = useState(memberRole);
    const [changeError, setChangeError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const privateAxios = usePrivateAxios();
    const onFinish = async () => {
        console.log(memSelectedRole);
        setChangeError(null);
        setIsLoading(true);
        privateAxios
            .get(`group/updateUser`, {
                params: { groupId, username: memberName, role: memSelectedRole }
            })
            .then((response) => {
                console.log(response);
                afterMemberRoleChanged(memberName, memSelectedRole);
            })
            .catch((error) => {
                console.log(error);
                setChangeError("Change role failed.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="rounded-md w-full flex flex-col">
            <h3 className="mb-2 text-md font-bold">
                Change role for{" "}
                {memberDisplayName !== memberName
                    ? `${memberDisplayName} (${memberName})`
                    : memberDisplayName}
            </h3>
            <Form form={form} onFinish={onFinish}>
                <Radio.Group
                    name="role_group"
                    defaultValue={memSelectedRole}
                    onChange={(e) => {
                        console.log(e);
                        setMemSelectedRole(e.target.value);
                    }}
                >
                    <Space direction="vertical" className="text-neutral-600 font-medium text-lg">
                        <Radio value={2}>
                            Co-owner &#40;Can add, delete normal member and change role for manager
                            and normal member&#41;
                        </Radio>
                        <Radio value={3}>Normal member &#40;Lowest role&#41;</Radio>
                    </Space>
                </Radio.Group>
                <p className="text-red-400 my-1">{changeError}</p>
                <Form.Item>
                    <button
                        type="submit"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        className="inline-flex float-right justify-center mt-2 py-2 px-4 border border-transparent
                            shadow-sm text-sm font-medium rounded-md text-white bg-purple-700
                            hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                                Changing...
                            </div>
                        ) : (
                            "Change role"
                        )}
                    </button>
                </Form.Item>
            </Form>
        </div>
    );
}

ChangeMemberRoleModalBody.propTypes = {
    groupId: PropTypes.number,
    memberRole: PropTypes.number.isRequired,
    memberName: PropTypes.string.isRequired,
    memberDisplayName: PropTypes.string.isRequired,
    afterMemberRoleChanged: PropTypes.func
};
ChangeMemberRoleModalBody.defaultProps = {
    groupId: 0,
    afterMemberRoleChanged: null
};

export default ChangeMemberRoleModalBody;
