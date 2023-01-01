import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

function ModalFrame({
    width,
    height,
    isVisible,
    hasXCloseBtn,
    clickOutSideToClose,
    onClose,
    children
}) {
    if (!isVisible) return null;

    function renderXCloseBtn() {
        if (!hasXCloseBtn) return null;
        return (
            <button
                type="button"
                className="mb-1 px-3 py-1 rounded-lg text-md font-bold text-gray-300 hover:text-black hover:bg-gray-200 place-self-end"
                onClick={() => onClose()}
            >
                <IoClose size={25} />
            </button>
        );
    }

    const handleClickOutSide = (e) => {
        if (e.target.id === "outSideModal") {
            if (clickOutSideToClose) {
                onClose();
            }
        }
    };

    return (
        <div
            id="outSideModal"
            className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center break-words"
            onClick={handleClickOutSide}
            aria-hidden="true"
        >
            <div
                className={`modal_body ${width} ${height} px-3 py-2 bg-white rounded-md flex flex-col justify-center items-center`}
            >
                {renderXCloseBtn()}
                {children}
            </div>
        </div>
    );
}

ModalFrame.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    isVisible: PropTypes.bool,
    hasXCloseBtn: PropTypes.bool,
    clickOutSideToClose: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.any.isRequired
};
ModalFrame.defaultProps = {
    width: "auto",
    height: "auto",
    isVisible: null,
    clickOutSideToClose: true,
    hasXCloseBtn: true
};

export default ModalFrame;
