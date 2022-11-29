/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import jwtDecode from "jwt-decode";
import ViewRoutes from "./routes";
import { getToken } from "./auth";
import "./App.css";
import AddGroupModalContext from "./components/contexts/add_group_context";
import ModalFrame from "./components/modals/modal_frame";
import AddGroupModalBody from "./components/modals/add_group_modal_body";

const queryClient = new QueryClient();

function App() {
    const [user, setUser] = useState(null);
    const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const addGroupModalContextValue = useMemo(() => ({
        showAddGroupModal,
        setShowAddGroupModal
    }));

    useEffect(() => {
        const getUser = async () => {
            fetch("http://localhost:5000/auth/login/success", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "Access-Control-Allow-Credentials": true
                }
            })
                .then((res) => {
                    if (res.status === 200) return res.json();
                    throw new Error("authentication has been failed!");
                })
                .then((resObject) => {
                    const decodeToken = jwtDecode(resObject.accessToken, "letsplay");
                    const userInfo = {
                        name: decodeToken.displayName,
                        avatar: decodeToken.photos[0]
                    };
                    setUser(userInfo);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getUser();
    }, []);

    console.log(user);

    return (
        <AddGroupModalContext.Provider value={addGroupModalContextValue}>
            <div className="pb-5">
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Routes>
                            {ViewRoutes.map(({ path, exact, component }, key) => {
                                const routeKey = `route${key}`;
                                const accessToken = getToken();
                                let firstComponent = component;
                                console.log(accessToken);
                                if (
                                    (path === "/login" ||
                                        path === "/register" ||
                                        path === "/group_detail/:groupname" ||
                                        path === "/account/:username") &&
                                    accessToken
                                ) {
                                    firstComponent = <Navigate to="/" />;
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
    );
}

export default App;
