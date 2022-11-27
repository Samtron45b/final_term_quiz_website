import { useState } from "react";
import { useForm } from "react-hook-form";

function ProfileViewEdit() {
    const username = "Nguyen Khanh Huy";
    const email = "nkhuy@gmail.com";
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username,
            email
        }
    });

    const onSubmit = (data) => {
        console.log(data);
    };
    const [isEditing, setIsEditing] = useState(false);
    if (isEditing === null) {
        setIsEditing(false);
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
                    type="button"
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
                <div className="email-input mb-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                        Email
                        <input
                            disabled={!isEditing}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="john.doe@example.com"
                            className="shadow-sm
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-1/2 sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                            {...register("email", { required: true })}
                        />
                        {errors.email && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                <div className="username-input mb-5">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                        Username
                        <input
                            name="username"
                            className="shadow-sm
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-1/2 sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                            disabled={!isEditing}
                            id="username"
                            type="text"
                            placeholder="Quamon"
                            {...register("username", { required: true })}
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
