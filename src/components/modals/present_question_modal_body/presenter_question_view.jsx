/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import InfiniteScroll from "../../infinite_scroll";

function PresenterQuestionView({
    unAnsweredQuestionList,
    answeredQuestionList,
    renderSingleQuestion,
    hasMoreUnAnswered,
    hasMoreAnswered,
    loadMoreQuestion
}) {
    const renderQuestionList = (questionList, isUnAnsweredList) => {
        const title = isUnAnsweredList ? "Un-answered" : "Answered";
        return (
            <div className="w-[48%] h-full overflow-hidden">
                <p className="w-full text-center text-neutral-500 text-lg font-semibold">{title}</p>
                <div className="mt-1 w-full h-[90%]">
                    <InfiniteScroll
                        dataSource={questionList}
                        itemRender={(question) => {
                            return renderSingleQuestion(question);
                        }}
                        dividerRender={<div className="w-full h-[1px] bg-neutral-300" />}
                        hasMore={isUnAnsweredList ? hasMoreUnAnswered : hasMoreAnswered}
                        loadMore={loadMoreQuestion}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-row w-full h-[70%] justify-between">
            {renderQuestionList(unAnsweredQuestionList, true)}
            <div className="w-[2px] h-full bg-neutral-400" />
            {renderQuestionList(answeredQuestionList)}
        </div>
    );
}

PresenterQuestionView.propTypes = {
    unAnsweredQuestionList: PropTypes.array,
    answeredQuestionList: PropTypes.array,
    renderSingleQuestion: PropTypes.func,
    hasMoreUnAnswered: PropTypes.bool,
    hasMoreAnswered: PropTypes.bool,
    loadMoreQuestion: PropTypes.func
};
PresenterQuestionView.defaultProps = {
    unAnsweredQuestionList: [],
    answeredQuestionList: [],
    renderSingleQuestion: null,
    hasMoreUnAnswered: false,
    hasMoreAnswered: false,
    loadMoreQuestion: null
};

export default PresenterQuestionView;
