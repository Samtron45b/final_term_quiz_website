import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import AuthContext from "../contexts/auth_context";

function AddGroupPresentationModalBody({ addingType, setShowModal }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [errorMess, setErrorMess] = useState(null);
    const [service, setService] = useState("");

    useEffect(() => {
        if (addingType === 1) {
            setService("group");
        } else {
            setService("presentation");
        }
    }, [addingType]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log(data);
        const token = localStorage.getItem("accessToken");
        const url =
            addingType === 1
                ? `${process.env.REACT_APP_BASE_URL}group/create?username=${user.username}&groupname=${data.name}`
                : `${process.env.REACT_APP_BASE_URL}presentation/create?presentationName=${data.name}`;
        console.log(url);
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                setShowModal(0);
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
                <div className="name-input mb-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                        {addingType === 1 ? "Group" : "Presentation"} name
                        <input
                            name="name"
                            className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                            id="name"
                            type="text"
                            placeholder="ABC"
                            {...register("name", { required: "Name is required." })}
                        />
                    </label>
                </div>
                <p className="text-red-400 text-sm">{errors.name?.message || errorMess}</p>
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
            </form>
        </div>
    );
}

AddGroupPresentationModalBody.propTypes = {
    addingType: PropTypes.number,
    setShowModal: PropTypes.func
};
AddGroupPresentationModalBody.defaultProps = {
    addingType: 0,
    setShowModal: null
};

export default AddGroupPresentationModalBody;
