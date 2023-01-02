/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { convertTimeStampToDate } from "../../utilities";
import InfiniteScroll from "../infinite_scroll";

function PresentResultModalBody({ presentationName, resultList, hasMore, loadMoreResult }) {
    const itemRender = (childData) => {
        const { user: userAnswer, optionText, question, timeAnswered } = childData;
        const renderString = `${userAnswer} choosed option "${optionText}" for question "${question}" at "${convertTimeStampToDate(
            {
                date: new Date(timeAnswered),
                showTime: true
            }
        )}"`;
        return <p className="p-2 text-md font-medium text-neutral-500">{renderString}</p>;
    };

    return (
        <div className="rounded-md w-full h-[95%] flex flex-col overflow-hidden">
            <p className="font-bold text-neutral-500 text-lg">
                Result of presentation {presentationName}
            </p>
            <div className="h-full mt-1 p-2 overflow-auto border-2 border-neutral-400 rounded-md shadow-inner shadow-neutral-300">
                <InfiniteScroll
                    dataSource={resultList.concat([]).reverse()}
                    itemRender={itemRender}
                    dividerRender={<div className="w-full h-[1.5px] bg-neutral-400" />}
                    hasMore={hasMore}
                    loadMore={loadMoreResult}
                />
            </div>
        </div>
    );
}

PresentResultModalBody.propTypes = {
    presentationName: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    resultList: PropTypes.array,
    hasMore: PropTypes.bool,
    loadMoreResult: PropTypes.func
};
PresentResultModalBody.defaultProps = {
    presentationName: "",
    resultList: [],
    hasMore: false,
    loadMoreResult: null
};

export default PresentResultModalBody;
