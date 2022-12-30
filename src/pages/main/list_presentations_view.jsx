/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import { useState } from "react";
import { ImSpinner10 } from "react-icons/im";
import ModalFrame from "../../components/modals/modal_frame";
import StartPresentModalBody from "../../components/modals/start_present_modal_body";
import TablePresentation from "./presentation_table";

function MainLisPresentationsView({
    isOwnPresentationFetching,
    isCollabPresentationFetching,
    listOwnPresentation,
    listCollabPresentation,
    onSelectPresentationRemove,
    updateAfterRemovePresentation
}) {
    const [presentationToPresent, setPresentationToPresent] = useState(null);

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
                        setPresentationToPresent={setPresentationToPresent}
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
    return (
        <>
            {renderListPresentation()}
            <ModalFrame
                width="w-2/5"
                height="max-h-3/5"
                clickOutSideToClose={false}
                isVisible={presentationToPresent !== null}
                onClose={() => setPresentationToPresent(null)}
            >
                <StartPresentModalBody presentationToPresent={presentationToPresent} />
            </ModalFrame>
        </>
    );
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
