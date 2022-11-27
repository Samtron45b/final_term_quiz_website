import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function MainGroupCard({ groupName, ownerName }) {
    return (
        <Link to={`/group_detail/${groupName}`} className="bg-white p-6 rounded-lg shadow-lg mb-6 ">
            <h2 className="text-lg truncate font-bold mb-1 text-gray-800">{groupName}</h2>
            <div className="flex">
                <img
                    className="w-6 h-6 rounded-full mr-2 bg-black"
                    src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                    alt=""
                />
                <p className="text-gray-700 truncate">{ownerName}</p>
            </div>
        </Link>
    );
}

MainGroupCard.propTypes = {
    groupName: PropTypes.string.isRequired,
    ownerName: PropTypes.string.isRequired
};

export default MainGroupCard;