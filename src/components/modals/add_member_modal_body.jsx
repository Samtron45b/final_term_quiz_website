import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner10 } from "react-icons/im";

function AddMemberModalBody() {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data) => console.log(data);

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
                        Member name
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
                    <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                        Member name
                        <input
                            name="username"
                            className="shadow-sm
                                    focus:ring-indigo-500 focus:border-indigo-500 mt-1
                                    block w-full sm:text-sm border-gray-300
                                    px-2 py-2 bg-white border rounded-md "
                            id="username"
                            type="text"
                            placeholder="ABC"
                            {...register("username", { required: true })}
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

export default AddMemberModalBody;
