import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import AuthContext from "../contexts/auth_context";

function AddGroupModalBody({ setShowModal }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [errorMess, setErrorMess] = useState(null);

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);
        axios
            .get(
                `${process.env.REACT_APP_BASE_URL}group/create?username=${user.username}&groupname=${data.groupname}`
            )
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                setShowModal(false);
                if (window.location.pathname === "/") {
                    window.location.reload();
                }
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
                <div className="username-input mb-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="groupname">
                        Group name
                        <input
                            name="groupname"
                            className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                            id="groupname"
                            type="text"
                            placeholder="ABC"
                            {...register("groupname", { required: true })}
                        />
                    </label>
                </div>
                <p className="text-red-400 mb-1 text-sm">
                    {errors.groupname?.message || errorMess}
                </p>
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
                            Adding group...
                        </div>
                    ) : (
                        "Add group"
                    )}
                </button>
            </form>
        </div>
    );
}

AddGroupModalBody.propTypes = {
    setShowModal: PropTypes.func
};
AddGroupModalBody.defaultProps = {
    setShowModal: null
};

export default AddGroupModalBody;
