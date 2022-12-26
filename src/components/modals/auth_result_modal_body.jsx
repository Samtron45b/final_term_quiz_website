import PropTypes from "prop-types";
import { MdDone, MdError } from "react-icons/md";
import { IoWarning } from "react-icons/io5";

function AuthResultModalBody({ authStatus, resultText, message, onClose }) {
    function renderResult() {
        const iconSize = 70;
        let resultIcon = <MdDone size={iconSize} className="text-green-400" />;
        if (authStatus === 2) resultIcon = <MdError size={iconSize} className="text-red-500" />;
        if (authStatus === 3)
            resultIcon = <IoWarning size={iconSize} className="text-orange-400" />;

        let result = resultText;
        if (!result) {
            if (authStatus === 1) result = "Succeeded";
            if (authStatus === 2) result = "Failed";
            if (authStatus === 3) result = "Warning";
        }
        return (
            <>
                {resultIcon}
                <p className="mt-1 break-words text-center text-md font-bold">{result}</p>
            </>
        );
    }

    function renderMessage() {
        if (message) {
            return (
                <p className="mt-2 break-words text-center">
                    <b>Note:</b>
                    {` ${message}`}
                </p>
            );
        }
        return null;
    }

    return (
        <div className=" bg-white rounded-md flex flex-col justify-center items-center">
            {renderResult()}
            {renderMessage()}
            <button
                type="button"
                className="mt-3 px-3 py-1 rounded-md text-black text-md bg-white border border-gray-400"
                onClick={() => onClose()}
            >
                OK
            </button>
        </div>
    );
}

AuthResultModalBody.propTypes = {
    authStatus: PropTypes.number,
    resultText: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func
};
AuthResultModalBody.defaultProps = {
    authStatus: null,
    resultText: null,
    message: "",
    onClose: null
};

export default AuthResultModalBody;
