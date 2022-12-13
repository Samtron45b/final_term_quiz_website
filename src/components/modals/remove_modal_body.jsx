import React, { useState } from "react";
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";

function RemoveModalBody({ objectToRemove, message, onClose, onConfirmRemove }) {
    console.log(objectToRemove, message);
    const [isLoading, setIsLoading] = useState(false);

    function renderObjectToRemove() {
        console.log(objectToRemove);
        return objectToRemove?.name ?? "";
    }

    async function executeOnConfirmRemove() {
        if (objectToRemove?.onConfirmRemove) {
            return objectToRemove?.onConfirmRemove();
        }
        return onConfirmRemove();
    }

    return (
        <div className="rounded-md w-full">
            <h2 className="mb-2 text-lg font-bold">
                Are you sure you want to remove {renderObjectToRemove()}?
            </h2>
            <p className="text-md font-semibold">{message ? `Note: ${message}` : null}</p>
            <div className="flex w-full justify-center items-center space-x-5">
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    onClick={async () => {
                        setIsLoading(true);
                        executeOnConfirmRemove()
                            .catch((error) => {
                                console.log(error);
                            })
                            .finally(() => {
                                setIsLoading(false);
                            });
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
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    onClick={() => onClose()}
                    className="inline-flex float-right justify-center py-2 px-4 border border-transparent
                        shadow-sm text-sm font-medium rounded-md text-white bg-neutral-400
                        hover:bg-neutral-300 focus:outline-none focus:bg-neutral-500"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

RemoveModalBody.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    objectToRemove: PropTypes.object,
    message: PropTypes.string,
    onClose: PropTypes.func,
    onConfirmRemove: PropTypes.func
};
RemoveModalBody.defaultProps = {
    objectToRemove: null,
    message: null,
    onClose: null,
    onConfirmRemove: null
};

export default RemoveModalBody;
