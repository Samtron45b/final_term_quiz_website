import PropTypes from "prop-types";
import { RiQuestionnaireFill, RiMessengerFill } from "react-icons/ri";

function QuestionChatBtn({ onQuestionBtnClick }) {
    const iconSize = 20;
    return (
        <div
            id="question_chat_btn"
            className="fixed inset-x-0 bottom-0 z-30 p-8 bg-transparent flex flex-row justify-end items-center gap-x-2"
        >
            <button
                type="button"
                onClick={() => onQuestionBtnClick()}
                className="text-white bg-neutral-200 font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <RiQuestionnaireFill size={iconSize} className="text-neutral-500" />
            </button>
            <button
                type="button"
                className="text-white bg-neutral-200 font-medium rounded-full text-sm p-2 text-center inline-flex items-center"
            >
                <RiMessengerFill size={iconSize} className="text-neutral-500" />
            </button>
        </div>
    );
}

QuestionChatBtn.propTypes = {
    onQuestionBtnClick: PropTypes.func
};
QuestionChatBtn.defaultProps = {
    onQuestionBtnClick: null
};

export default QuestionChatBtn;
