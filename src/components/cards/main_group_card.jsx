import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function MainGroupCard({ groupId, groupName, ownerDisplayName, ownerAvatar }) {
    return (
        <Link to={`/group_detail/${groupId}`} className="bg-white p-6 rounded-lg shadow-lg mb-6 ">
            <h2 className="text-lg truncate font-bold mb-1 text-gray-800">{groupName}</h2>
            <div className="flex">
                <img className="w-6 h-6 rounded-full mr-2 bg-black" src={ownerAvatar} alt="" />
                <p className="text-gray-700 truncate">{ownerDisplayName}</p>
            </div>
        </Link>
    );
}

MainGroupCard.propTypes = {
    groupId: PropTypes.number.isRequired,
    groupName: PropTypes.string.isRequired,
    ownerDisplayName: PropTypes.string.isRequired,
    ownerAvatar: PropTypes.string.isRequired
};

export default MainGroupCard;
