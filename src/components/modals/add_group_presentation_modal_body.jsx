import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner10 } from "react-icons/im";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/auth_context";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";

function AddGroupPresentationModalBody({ addingType, setShowModal, params }) {
    console.log(params);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [errorMess, setErrorMess] = useState(null);
    const [service, setService] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const privateAxios = usePrivateAxios();

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
                if (location.pathname === "/") {
                    navigate("/temp");
                    setTimeout(() => navigate("/", { replace: true }), 100);
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
