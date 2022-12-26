import { Col, Row } from "antd";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AiOutlineUserDelete } from "react-icons/ai";
import usePrivateAxios from "../../../configs/networks/usePrivateAxios";
import AuthContext from "../../contexts/auth_context";

function ListCollaborators({
    presentationId,
    presentationName,
    isOwner,
    collaboratorsList,
    onDeleteBtnClick,
    updateCollaboratorList
}) {
    const { user } = useContext(AuthContext);
    const privateAxios = usePrivateAxios();
    console.log(user, presentationId, isOwner, collaboratorsList);

    function renderCollaboratorName(collaboratorDisplayName, collaboratorName) {
        let nameToRender = collaboratorDisplayName;
        if (collaboratorDisplayName !== collaboratorName) {
            nameToRender = `${collaboratorDisplayName} (${collaboratorName})`;
        }
        return nameToRender;
    }

    async function onDeleteCollaborator(collaboratorName) {
        return privateAxios
            .get(`presentation/deleteCollaborator`, {
                params: {
                    presentationId,
                    username: collaboratorName
                }
            })
            .then((response) => {
                console.log(response);
                updateCollaboratorList(collaboratorName);
            });
    }

    function renderListCollaborators() {
        const { length } = collaboratorsList;
        const listCollaboratorsView = [];
        for (let i = 0; i < length; i += 1) {
            const { username, displayName, avatarUrl } = collaboratorsList[i];
            const collaboratorName = renderCollaboratorName(displayName, username);
            listCollaboratorsView.push(
                <Row
                    className="items-center"
                    key={`${presentationId}_collaborator_${i}`}
                    wrap={false}
                >
                    <Col flex="auto">
                        <div className="flex items-center">
                            <img
                                className="w-8 h-8 rounded-full mr-4 bg-black"
                                src={
                                    avatarUrl ??
                                    "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                                }
                                alt=""
                            />
                            <p className="text-lg text-gray-700 truncate">{collaboratorName}</p>
                        </div>
                    </Col>
                    <Col hidden={!isOwner} flex="none">
                        <AiOutlineUserDelete
                            size={20}
                            className="text-red-500"
                            onClick={() =>
                                onDeleteBtnClick({
                                    name: `${collaboratorName} from presentation ${presentationName}`,
                                    onConfirmRemove: () => onDeleteCollaborator(username)
                                })
                            }
                        />
                    </Col>
                </Row>
            );
        }

        if (listCollaboratorsView.length === 0) {
            return (
                <div className="w-full h-full flex justify-center items-center break-words text-center text-neutral-400">
                    Not have any collaborators yet.
                </div>
            );
        }

        return listCollaboratorsView;
    }

    return (
        <div className="h-[84%] overflow-hidden flex flex-col">
            <p className="text-md text-gray-700 font-medium">Collaborators list</p>
            <div className="h-full mt-1 p-2 overflow-auto border-2 border-neutral-400 rounded-md shadow-inner shadow-neutral-300">
                {renderListCollaborators()}
            </div>
        </div>
    );
}

ListCollaborators.propTypes = {
    presentationId: PropTypes.number.isRequired,
    presentationName: PropTypes.string,
    isOwner: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    collaboratorsList: PropTypes.array,
    onDeleteBtnClick: PropTypes.func,
    updateCollaboratorList: PropTypes.func
};
ListCollaborators.defaultProps = {
    presentationName: "",
    isOwner: false,
    collaboratorsList: [],
    onDeleteBtnClick: null,
    updateCollaboratorList: null
};

export default ListCollaborators;
