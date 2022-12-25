import PropTypes from "prop-types";
import AddCollaboratorForm from "./add_collaborator_form";
import ListCollaborators from "./list_collaborators";

function PresentationCollabModalBody({
    presentationId,
    presentationName,
    isOwner,
    collaboratorsList,
    onDeleteCollaboratorBtnClick,
    updateCollaboratorList
}) {
    return (
        <div className="rounded-md w-full h-[95%] flex flex-col">
            {isOwner ? <AddCollaboratorForm presentationId={presentationId} /> : null}
            <ListCollaborators
                presentationId={presentationId}
                presentationName={presentationName}
                isOwner={isOwner}
                collaboratorsList={collaboratorsList}
                onDeleteBtnClick={onDeleteCollaboratorBtnClick}
                updateCollaboratorList={updateCollaboratorList}
            />
        </div>
    );
}

PresentationCollabModalBody.propTypes = {
    presentationId: PropTypes.number.isRequired,
    presentationName: PropTypes.string,
    isOwner: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    collaboratorsList: PropTypes.array,
    onDeleteCollaboratorBtnClick: PropTypes.func,
    updateCollaboratorList: PropTypes.func
};
PresentationCollabModalBody.defaultProps = {
    presentationName: "",
    isOwner: false,
    collaboratorsList: [],
    onDeleteCollaboratorBtnClick: null,
    updateCollaboratorList: null
};

export default PresentationCollabModalBody;
