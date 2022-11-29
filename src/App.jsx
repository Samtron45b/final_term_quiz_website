/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ViewRoutes from "./routes";
import { getToken } from "./auth";
import "./App.css";
import AddGroupModalContext from "./components/contexts/add_group_context";
import ModalFrame from "./components/modals/modal_frame";
import AddGroupModalBody from "./components/modals/add_group_modal_body";
import AuthContext from "./components/contexts/auth_context";

const queryClient = new QueryClient();

function App() {
    const accessToken = getToken();
    console.log(`accessToken ${accessToken}`);
    const [isInitialWeb, setIsInitialWeb] = useState(true);
    const [user, setUser] = useState({});

    if (isInitialWeb) {
        if (accessToken !== null) {
            setUser({
                name: "Nguyen Khanh Huy",
                avatar: "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
            });
        }
        setIsInitialWeb(false);
    }

    const authContextValue = useMemo(() => ({
        user,
        setUser
    }));
    const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const addGroupModalContextValue = useMemo(() => ({
        showAddGroupModal,
        setShowAddGroupModal
    }));

    return (
        <AuthContext.Provider value={authContextValue}>
            <AddGroupModalContext.Provider value={addGroupModalContextValue}>
                <div className="pb-5">
                    <QueryClientProvider client={queryClient}>
                        <Router>
                            <Routes>
                                {ViewRoutes.map(({ path, exact, component }, key) => {
                                    const routeKey = `route${key}`;
                                    let firstComponent = component;
                                    if (path === "/login" || path === "/register") {
                                        if (accessToken) {
                                            firstComponent = <Navigate to="/" />;
                                        }
                                    } else if (!accessToken) {
                                        firstComponent = <Navigate to="/login" />;
                                    }

                                    return (
                                        <Route
                                            key={routeKey}
                                            exact={exact}
                                            path={path}
                                            element={firstComponent}
                                        />
                                    );
                                })}
                            </Routes>
                        </Router>
                    </QueryClientProvider>
                </div>
                <ModalFrame
                    width="40%"
                    isVisible={showAddGroupModal}
                    clickOutSideToClose={false}
                    onClose={() => setShowAddGroupModal(false)}
                >
                    <AddGroupModalBody />
                </ModalFrame>
            </AddGroupModalContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
