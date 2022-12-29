import PropTypes from "prop-types";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { GiChoice } from "react-icons/gi";

function ChangeSlideResultField({ canMoveLeft, canMoveRight, onSlideChanged, onResultBtnClick }) {
    const iconSize = 20;
    const arrowActiveClassName = "text-neutral-300 hover:text-white";
    return (
        <div
            id="change_slide_result_field"
            className="fixed left-0 bottom-0 z-30 ml-8 mb-8 px-4 rounded-2xl bg-neutral-500 flex flex-row justify-start items-center gap-x-2"
        >
            <button
                type="button"
                onClick={() => onSlideChanged(-1)}
                className="text-white bg-transparent hover:bg-neutral-200/[15%] font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <AiOutlineArrowLeft
                    size={iconSize}
                    className={`${canMoveLeft ? arrowActiveClassName : "text-neutral-400"}`}
                />
            </button>
            <button
                type="button"
                onClick={() => onSlideChanged(1)}
                className="text-white bg-transparent hover:bg-neutral-200/[15%] font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <AiOutlineArrowRight
                    size={iconSize}
                    className={`${canMoveRight ? arrowActiveClassName : "text-neutral-400"}`}
                />
            </button>
            <button
                type="button"
                onClick={() => onResultBtnClick()}
                className="ml-3 text-white bg-transparent hover:bg-neutral-200/[15%] font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <GiChoice size={iconSize} className="text-white" />
            </button>
        </div>
    );
}

ChangeSlideResultField.propTypes = {
    canMoveLeft: PropTypes.number,
    canMoveRight: PropTypes.number,
    onSlideChanged: PropTypes.func,
    onResultBtnClick: PropTypes.func
};
ChangeSlideResultField.defaultProps = {
    canMoveLeft: 0,
    canMoveRight: 0,
    onSlideChanged: null,
    onResultBtnClick: null
};

export default ChangeSlideResultField;
