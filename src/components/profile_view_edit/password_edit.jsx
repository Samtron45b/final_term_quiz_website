import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PassswordEdit() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };
    const [canChangePass, setCanChangePass] = useState(false);
    const [showCurPass, setShowCurPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
    if (canChangePass === null) {
        setCanChangePass(false);
    }

    function renderButton() {
        if (!canChangePass) {
            return (
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-flex justify-center py-2 px-4 border border-transparent
                    shadow-sm text-sm font-medium rounded-lg text-white bg-purple-700
                    hover:bg-purple-600"
                    onClick={() => setCanChangePass(true)}
                >
                    Check current password
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
                    Save new password
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
                        setCanChangePass(false);
                    }}
                >
                    Cancel change password
                </button>
            </div>
        );
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 w-1/2">
                    <label
                        className="block text-sm font-medium text-gray-700 relative"
                        htmlFor="password"
                    >
                        Current password
                        <input
                            type={showCurPass ? "text" : "password"}
                            name="password"
                            className="shadow-sm
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-full sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                            disabled={canChangePass}
                            id="password"
                            placeholder="********"
                            {...register("password", { required: true }, { minLength: 8 })}
                        />
                        <div
                            className="icon_button absolute right-4 top-8"
                            onClick={() => {
                                setShowCurPass(!showCurPass);
                            }}
                            aria-hidden="true"
                        >
                            {showCurPass ? (
                                <FaEye className="w-5 h-5" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5" />
                            )}
                        </div>
                        {errors.password && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                <div className="mb-3 w-1/2">
                    <label
                        className="block text-sm font-medium text-gray-700 relative"
                        htmlFor="password"
                    >
                        New password
                        <input
                            type={showNewPass ? "text" : "password"}
                            name="password"
                            className="shadow-sm
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-full sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                            disabled={!canChangePass}
                            id="password"
                            placeholder="********"
                            {...register("password", { required: true }, { minLength: 8 })}
                        />
                        <div
                            className="icon_button absolute right-4 top-8"
                            onClick={() => {
                                setShowNewPass(!showNewPass);
                            }}
                            aria-hidden="true"
                        >
                            {showNewPass ? (
                                <FaEye className="w-5 h-5" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5" />
                            )}
                        </div>
                        {errors.password && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                <div className="mb-3 w-1/2">
                    <label
                        className="block text-sm font-medium text-gray-700 relative"
                        htmlFor="re_password"
                    >
                        Confirm new password
                        <input
                            type={showConfirmNewPass ? "text" : "password"}
                            name="re_password"
                            className="shadow-sm
                                focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                block w-full sm:text-sm border border-gray-300 rounded-md
                                px-2 py-2 bg-white border rounded-md "
                            disabled={!canChangePass}
                            id="re_password"
                            placeholder="********"
                            {...register("re_password", { required: true }, { minLength: 8 })}
                        />
                        <div
                            className="icon_button absolute right-4 top-8"
                            onClick={() => {
                                setShowConfirmNewPass(!showConfirmNewPass);
                            }}
                            aria-hidden="true"
                        >
                            {showConfirmNewPass ? (
                                <FaEye className="w-5 h-5" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5" />
                            )}
                        </div>
                        {errors.re_password && (
                            <span className="text-red-600">This field is required</span>
                        )}
                    </label>
                </div>
                {renderButton()}
            </form>
        </div>
    );
}

export default PassswordEdit;
