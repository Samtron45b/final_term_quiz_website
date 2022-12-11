import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner10 } from "react-icons/im";
import { getUserDataFromServer } from "../../auth";
import usePrivateAxios from "../../configs/networks/usePrivateAxios";
import AuthContext from "../contexts/auth_context";

function ProfileViewEdit() {
    const { user } = useContext(AuthContext);
    const [isLoading, setLoaditing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        reset({
            username: user.username,
            displayName: user.displayName,
            email: user.email
        });
    }, []);
    const privateAxios = usePrivateAxios();
    const fetchUserData = getUserDataFromServer();

    const onSubmit = async (data) => {
        console.log(data);
        setLoaditing(true);
        privateAxios
            .get(
                `user/edit?username=${user.username}&displayName=${data.displayName}&email=${data.email}`
            )
            .then(async (response) => {
                console.log(response);
                fetchUserData().then(() => {
                    reset({
                        username: user.username,
                        displayName: data.displayName,
                        email: data.email
                    });
                });
                setIsEditing(false);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoaditing(false);
            });
    };

    function getInputClassName() {
        return `shadow-sm
        focus:border-indigo-500 mt-1 ${isEditing ? "text-gray-700" : "text-gray-500"}
        block w-full sm:text-sm border border-gray-300 rounded-md
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
                    className={`inline-flex justify-center py-2 px-4 border border-transparent
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
            <div className="flex w-1/2">
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
                        reset();
                        setIsEditing(false);
                    }}
                >
                    Cancel edit
                </button>
            </div>
        );
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="username-input mb-5 w-1/2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                        Display name
                        <input
                            name="username"
                            className={getInputClassName()}
                            disabled
                            id="username"
                            type="text"
                            placeholder="Quamon"
                            {...register("username")}
                        />
                        {errors.username && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                <div className="email-input mb-3 w-1/2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Email
                        <input
                            disabled={!isEditing}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="john.doe@example.com"
                            className={getInputClassName()}
                            {...register("email", { required: true })}
                        />
                        {errors.email && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                <div className="displayname-input mb-5 w-1/2">
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="displayName"
                    >
                        Display name
                        <input
                            name="displayName"
                            className={getInputClassName()}
                            disabled={!isEditing}
                            id="displayName"
                            type="text"
                            placeholder="Quamon"
                            {...register("displayName", { required: true })}
                        />
                        {errors.username && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                {renderButton()}
            </form>
        </div>
    );
}

export default ProfileViewEdit;
