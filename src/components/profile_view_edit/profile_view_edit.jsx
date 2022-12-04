import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../contexts/auth_context";

function ProfileViewEdit() {
    const { user } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios
            .get(`${process.env.REACT_APP_BASE_URL}user/get?username=${user.username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                reset({
                    displayName: response.data.data.displayName,
                    email: response.data.data.email
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const onSubmit = (data) => {
        console.log(data);
        const token = localStorage.getItem("accessToken");
        axios
            .get(
                `${process.env.REACT_APP_BASE_URL}user/edit?username=${user.username}&displayName=${data.displayName}&email=${data.email}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                console.log(response);
                reset({
                    displayName: data.displayName,
                    email: data.email
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const [isEditing, setIsEditing] = useState(false);
    if (isEditing === null) {
        setIsEditing(false);
    }

    function getInputClassName() {
        return `shadow-sm
        focus:border-indigo-500 mt-1 ${isEditing ? "text-gray-700" : "text-gray-500"}
        block w-full sm:text-sm border border-gray-300 rounded-md
        px-2 py-2 bg-white border rounded-md `;
    }

    function renderButton() {
        if (!isEditing) {
            return (
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex justify-center py-2 px-4 border border-transparent
                    shadow-sm text-sm font-medium rounded-lg text-white bg-purple-700
                    hover:bg-purple-600"
                    onClick={() => setIsEditing(true)}
                >
                    Edit profile
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
                <div className="username-input mb-5 w-1/2">
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
