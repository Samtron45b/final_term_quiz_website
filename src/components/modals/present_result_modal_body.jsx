/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import InfiniteScroll from "../infinite_scroll";

function PresentResultModalBody({
    presentationId,
    presentationName,
    resultList,
    updateResultList
}) {
    const renderListResults = () => {
        return resultList.map((result) => {
            return <p className="p-2 text-md font-medium text-neutral-500">{result}</p>;
        });
    };

    const itemRender = (childData) => {
        return <p className="p-2 text-md font-medium text-neutral-500">{childData}</p>;
    };

    return (
        <div className="rounded-md w-full h-[95%] flex flex-col overflow-hidden">
            <p className="font-bold text-neutral-500 text-lg">
                Result of presentation {presentationName}
            </p>
            <div className="h-full mt-1 p-2 overflow-auto border-2 border-neutral-400 rounded-md shadow-inner shadow-neutral-300">
                <InfiniteScroll dataSource={resultList} itemRender={itemRender} hasMore reversed />
            </div>
        </div>
    );
}

PresentResultModalBody.propTypes = {
    presentationId: PropTypes.number.isRequired,
    presentationName: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    resultList: PropTypes.array,
    updateResultList: PropTypes.func
};
PresentResultModalBody.defaultProps = {
    presentationName: "",
    resultList: [],
    updateResultList: null
};

export default PresentResultModalBody;
