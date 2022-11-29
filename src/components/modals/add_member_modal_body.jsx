import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";

function AddMemberModalBody({ groupName }) {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);
        axios
            .get(
                `https://45d6-2402-800-63b6-df31-61e7-55fc-79cc-bfa1.ap.ngrok.io/group/inviteUser?groupname=${groupName}&membername=${data.membername}`
            )
            .then((response) => {
                console.log(response);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };
    useEffect(() => {
        reset({
            grouplink: "grouplink"
        });
    }, []);

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
                                    block w-1/2 sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                            id="grouplink"
                            type="text"
                            placeholder="ABC"
                            {...register("grouplink", { required: true })}
                        />
                    </label>
                </div>
                <div className="username-input mb-3">
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
                            {...register("membername", { required: true })}
                        />
                        {errors.username && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    onClick={() => setIsLoading(true)}
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
    groupName: PropTypes.string.isRequired
};

export default AddMemberModalBody;
