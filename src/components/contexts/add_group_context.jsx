import { createContext } from "react";

const AddGroupModalContext = createContext({
    addingType: false,
    setAddingType: (addGroupModalVisible) => addGroupModalVisible ?? false
});

export default AddGroupModalContext;
