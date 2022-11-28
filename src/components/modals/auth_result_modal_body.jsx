import PropTypes from "prop-types";
import { MdDone, MdError } from "react-icons/md";
import { IoWarning } from "react-icons/io5";

function AuthResultModalBody({ authStatus, message, onClose }) {
    function renderIcon() {
        const iconSize = 70;
        // eslint-disable-next-line default-case
        if (authStatus === 1) return <MdDone size={iconSize} className="text-green-400" />;
        if (authStatus === 2) return <IoWarning size={iconSize} className="text-orange-400" />;
        return <MdError size={iconSize} className="text-red-500" />;
    }

    return (
        <div className=" bg-white rounded-md flex flex-col justify-center items-center">
            {renderIcon()}
            <p className="mt-2 break-all text-center">{`${message}`}</p>
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
    message: PropTypes.string,
    onClose: PropTypes.func
};
AuthResultModalBody.defaultProps = {
    authStatus: null,
    message: "",
    onClose: null
};

export default AuthResultModalBody;
