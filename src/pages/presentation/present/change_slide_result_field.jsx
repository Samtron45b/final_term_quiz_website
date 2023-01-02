import PropTypes from "prop-types";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { GiChoice } from "react-icons/gi";
import { CgCloseR } from "react-icons/cg";

function ChangeSlideResultField({
    canMoveLeft,
    canMoveRight,
    onSlideChanged,
    onResultBtnClick,
    onCloseBtnClick
}) {
    const iconSize = 20;
    const arrowActiveClassName = "text-neutral-200 hover:text-white";
    return (
        <div
            id="change_slide_result_field"
            className="fixed left-0 bottom-0 z-30 ml-8 mb-8 px-4 rounded-2xl bg-neutral-500 flex flex-row justify-start items-center gap-x-2"
        >
            <button
                type="button"
                onClick={() => (canMoveLeft ? onSlideChanged(-1) : null)}
                className="text-white bg-transparent hover:bg-neutral-200/[15%] font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <AiOutlineArrowLeft
                    size={iconSize}
                    className={`${canMoveLeft ? arrowActiveClassName : "text-neutral-400"}`}
                />
            </button>
            <button
                type="button"
                onClick={() => (canMoveRight ? onSlideChanged(1) : null)}
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
            <button
                type="button"
                onClick={() => onCloseBtnClick()}
                className="ml-3 text-red-500 bg-transparent hover:bg-neutral-200/[15%] font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <CgCloseR size={iconSize} className="text-red-500" />
            </button>
        </div>
    );
}

ChangeSlideResultField.propTypes = {
    canMoveLeft: PropTypes.bool,
    canMoveRight: PropTypes.bool,
    onSlideChanged: PropTypes.func,
    onResultBtnClick: PropTypes.func,
    onCloseBtnClick: PropTypes.func
};
ChangeSlideResultField.defaultProps = {
    canMoveLeft: false,
    canMoveRight: false,
    onSlideChanged: null,
    onResultBtnClick: null,
    onCloseBtnClick: null
};

export default ChangeSlideResultField;
