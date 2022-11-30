import React, { useState } from "react";
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";

function RemoveModalBody({ objectToRemove, message, onConfirmRemove }) {
    console.log(objectToRemove, message);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="rounded-md w-full">
            <h2 className="mb-2 text-lg font-bold">
                Are you sure you want to remove {objectToRemove}
            </h2>
            <p className="text-md font-semibold">{message ? `Note: ${message}` : null}</p>
            <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={async () => {
                    setIsLoading(true);
                    await onConfirmRemove();
                    setIsLoading(false);
                }}
                className="inline-flex float-right justify-center py-2 px-4 border border-transparent
                        shadow-sm text-sm font-medium rounded-md text-white bg-purple-700
                        hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
            >
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <ImSpinner10 className="animate-spin h-5 w-5 mr-3" />
                        Removing...
                    </div>
                ) : (
                    "Remove"
                )}
            </button>
        </div>
    );
}

RemoveModalBody.propTypes = {
    objectToRemove: PropTypes.string.isRequired,
    message: PropTypes.string,
    // eslint-disable-next-line react/require-default-props
    onConfirmRemove: PropTypes.func
};
RemoveModalBody.defaultProps = {
    message: null,
    onConfirmRemove: null
};

export default RemoveModalBody;
