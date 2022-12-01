import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import AuthContext from "../contexts/auth_context";

function AddMemberModalBody({ groupName, inviteId }) {
    const { user } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            grouplink: `http://localhost:3000/invite/${inviteId}`
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMess, setErrorMess] = useState(null);

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);
        axios
            .get(
                `${process.env.REACT_APP_BASE_URL}group/invite?groupname=${groupName}&inviteId=${inviteId}&sender=${user.username}&receiver=${data.membername}`
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

    return (
        <div className="rounded-md w-full flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grouplink-input mb-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="grouplink">
                        Group link
                        <input
                            disabled
                            name="grouplink"
                            className="shadow-sm italic font-normal
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                            id="grouplink"
                            type="text"
                            placeholder="ABC"
                            {...register("grouplink")}
                        />
                    </label>
                </div>
                <div className="membername-input mb-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="membername">
                        Member name
                        <input
                            name="membername"
                            className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                            id="membername"
                            type="text"
                            placeholder="ABC"
                            {...register("membername", { required: "Member name is required." })}
                        />
                        <p className="text-red-400 mb-1 text-sm">
                            {errors.membername?.message || errorMess}
                        </p>
                    </label>
                </div>
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
            </form>
        </div>
    );
}

AddMemberModalBody.propTypes = {
    groupName: PropTypes.string.isRequired,
    inviteId: PropTypes.string.isRequired
};

export default AddMemberModalBody;
