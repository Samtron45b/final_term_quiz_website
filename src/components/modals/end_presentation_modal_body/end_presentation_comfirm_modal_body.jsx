import React, { useState } from "react";
import PropTypes from "prop-types";
import { message as antdMessage } from "antd";
import { ImSpinner10 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

function EndPresentationConfirmModalBody({ onClose, onConfirmRemove }) {
    const [isLoading, setIsLoading] = useState(false);
    const [removeError, setRemoveError] = useState(null);

    const navigate = useNavigate();

    async function executeOnConfirmRemove() {
        return onConfirmRemove();
    }

    return (
        <div className="rounded-md w-full">
            <h2 className="mb-2 text-lg font-bold">
                Are you sure you want to end this present session?
            </h2>
            <p className="text-red-400">{removeError}</p>
            <div className="flex w-full justify-center items-center space-x-5">
                <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    onClick={async () => {
                        setIsLoading(true);
                        setRemoveError(null);
                        executeOnConfirmRemove()
                            .finally(() => {
                                antdMessage.success({
                                    content: `Session ended successfully.`
                                });
                                navigate("/", { replace: true });
                            })
                            .catch((error) => {
                                console.log(error);
                                antdMessage.error({
                                    content: `Failed to end this session. Please try again later.`
                                });
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
                            Ending...
                        </div>
                    ) : (
                        "End"
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

EndPresentationConfirmModalBody.propTypes = {
    onClose: PropTypes.func,
    onConfirmRemove: PropTypes.func
};
EndPresentationConfirmModalBody.defaultProps = {
    onClose: null,
    onConfirmRemove: null
};

export default EndPresentationConfirmModalBody;
