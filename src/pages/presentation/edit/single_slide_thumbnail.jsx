import PropTypes from "prop-types";
import { RiBarChart2Fill } from "react-icons/ri";

function PresentationSingleSlideThumbNail({ isSelected, onClick, id, index, question }) {
    return (
        <div
            key={id}
            className={`flex flex-row pr-3 py-2 h-1/6 cursor-pointer ${
                isSelected ? "bg-purple-400" : "bg-transparent"
            }`}
            aria-hidden="true"
            onClick={() => onClick()}
        >
            <div
                className={`w-2 h-1/2 mr-2 self-center ${
                    isSelected ? "bg-purple-600" : "bg-transparent"
                }`}
            />
            <p className="text-gray-500 mr-4">{index}</p>
            <div className="flex flex-col justify-center py-5 items-center w-full bg-white border border-black rounded-lg">
                <RiBarChart2Fill size={50} className="text-gray-400" />
                <p className="text-gray-400 mt-1 text-center">{question}</p>
            </div>
        </div>
    );
}

PresentationSingleSlideThumbNail.propTypes = {
    id: PropTypes.string,
    index: PropTypes.number,
    question: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

PresentationSingleSlideThumbNail.defaultProps = {
    id: "",
    index: 0,
    question: "",
    isSelected: false,
    onClick: null
};

export default PresentationSingleSlideThumbNail;
