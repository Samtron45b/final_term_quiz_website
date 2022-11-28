import { createContext } from "react";

const AddGroupModalContext = createContext({
    showAddGroupModal: false,
    setShowAddGroupModal: (addGroupModalVisible) => addGroupModalVisible ?? false
});

export default AddGroupModalContext;
