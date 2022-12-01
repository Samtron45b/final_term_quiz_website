import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";

function ChangeMemberRoleModalBody({ memberRole, userRole, memberName, memberDisplayName }) {
    console.log(memberRole, userRole, memberName);
    const { handleSubmit } = useForm();
    const [memSelectedRole, setMemSelectedRole] = useState(`${memberRole}`);
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = (data) => console.log(data);

    return (
        <div className="rounded-md w-full flex flex-col">
            <h3 className="mb-2 text-md font-bold">Change role for {memberDisplayName}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {userRole === 1 ? (
                    <div className="flex items-top space-x-2">
                        <input
                            type="radio"
                            value="2"
                            checked={memSelectedRole === "2"}
                            onChange={(e) => setMemSelectedRole(e.target.value)}
                        />
                        <p>
                            Co-owner &#40;Can add, delete normal member and change role for manager
                            and normal member&#41;
                        </p>
                    </div>
                ) : null}
                {/* <div className="flex items-top space-x-2">
                    <input
                        type="radio"
                        value="3"
                        checked={memSelectedRole === "3"}
                        onChange={(e) => setMemSelectedRole(e.target.value)}
                    />
                    <p>Manager &#40;Can add, delete normal memberr&#41;</p>
                </div> */}
                <div className="flex items-top space-x-2">
                    <input
                        type="radio"
                        value="3"
                        checked={memSelectedRole === "3"}
                        onChange={(e) => setMemSelectedRole(e.target.value)}
                    />
                    <p>Normal member &#40;Lowest role&#41;</p>
                </div>

                <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    onClick={() => setIsLoading(true)}
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
            </form>
        </div>
    );
}

ChangeMemberRoleModalBody.propTypes = {
    memberRole: PropTypes.number.isRequired,
    userRole: PropTypes.number.isRequired,
    memberName: PropTypes.string.isRequired,
    memberDisplayName: PropTypes.string.isRequired
};

export default ChangeMemberRoleModalBody;
