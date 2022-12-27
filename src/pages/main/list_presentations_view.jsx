/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import { ImSpinner10 } from "react-icons/im";
import TablePresentation from "./presentation_table";

function MainLisPresentationsView({
    isOwnPresentationFetching,
    isCollabPresentationFetching,
    listOwnPresentation,
    listCollabPresentation,
    onSelectPresentationRemove,
    updateAfterRemovePresentation
}) {
    function renderListPresentation() {
        const listPresentation = listOwnPresentation.concat(listCollabPresentation);
        console.log(listPresentation);
        function renderListPresentationData() {
            if (isOwnPresentationFetching && isCollabPresentationFetching) {
                return (
                    <div className="flex justify-center ">
                        <ImSpinner10 size={50} className="animate-spin mr-3 mb-2" />
                    </div>
                );
            }
            if (listPresentation.length > 0) {
                return (
                    <TablePresentation
                        groupName="a"
                        dataList={listPresentation}
                        onSelectPresentationRemove={onSelectPresentationRemove}
                        updateAfterRemovePresentation={updateAfterRemovePresentation}
                    />
                );
            }
            return (
                <p className="text-gray-300 text-center text-xl font-bold text-ellipsis mb-3">
                    Let create a presentation.
                </p>
            );
        }
        return renderListPresentationData();
    }
    return renderListPresentation();
}

MainLisPresentationsView.propTypes = {
    isOwnPresentationFetching: PropTypes.bool,
    isCollabPresentationFetching: PropTypes.bool,
    listOwnPresentation: PropTypes.array,
    listCollabPresentation: PropTypes.array,
    onSelectPresentationRemove: PropTypes.func,
    updateAfterRemovePresentation: PropTypes.func
};
MainLisPresentationsView.defaultProps = {
    isOwnPresentationFetching: false,
    isCollabPresentationFetching: false,
    listOwnPresentation: [],
    listCollabPresentation: [],
    onSelectPresentationRemove: null,
    updateAfterRemovePresentation: null
};

export default MainLisPresentationsView;
