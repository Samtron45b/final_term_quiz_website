import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";
import { ConfigProvider } from "antd";
import ViewRoutes from "./routes";
import { getToken } from "./auth";
import "./App.css";
import AuthContext from "./components/contexts/auth_context";
import { socket, SocketContext } from "./components/contexts/socket_context";

function App() {
    const queryClient = useQueryClient();
    const location = useLocation();
    // localStorage.clear();
    const accessToken = getToken();
    console.log(`accessToken ${accessToken}`);
    const [socketSubscribed, setSocketSubscribed] = useState(false);
    const [user, setUser] = useState(null);

    const listAuthPage = ["/login", "/register", "/forgot_password"];

    const userFromLocalStorage = JSON.parse(localStorage.getItem("userData"));
    if (userFromLocalStorage && !socketSubscribed) {
        socket.emit("subscribe", userFromLocalStorage.username);
        console.log("username to emit", userFromLocalStorage.username);
        setSocketSubscribed(true);
    }
    if (accessToken !== null) {
        setUser({ ...userFromLocalStorage });
    }

    const authContextValue = useMemo(() => ({
        user,
        setUser
    }));

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ["get_created_group_list"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_joined_group_list"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_own_presentation_list"], exact: true });
            queryClient.removeQueries({ queryKey: ["get_collab_presentation_list"], exact: true });
        };
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#9333ea"
                }
            }}
        >
            <SocketContext.Provider value={socket}>
                <AuthContext.Provider value={authContextValue}>
                    <div className="pb-5 h-screen">
                        <Routes>
                            {ViewRoutes.map(({ path, exact, component }, key) => {
                                const routeKey = `route${key}`;
                                let firstComponent = component;
                                if (listAuthPage.includes(path)) {
                                    if (accessToken) {
                                        firstComponent = <Navigate to="/" />;
                                    }
                                } else if (!path.includes("/activate_account")) {
                                    if (!accessToken) {
                                        firstComponent = (
                                            <Navigate
                                                to="/login"
                                                replace
                                                state={{ from: location.pathname }}
                                            />
                                        );
                                    } else if (
                                        !path.includes("/active_notify") &&
                                        userFromLocalStorage?.active === 0
                                    ) {
                                        firstComponent = (
                                            <Navigate
                                                to={`/active_notify/${userFromLocalStorage?.username}`}
                                                replace
                                                state={{ from: location.pathname }}
                                            />
                                        );
                                    } else if (
                                        path.includes("/active_notify") &&
                                        userFromLocalStorage?.active === 1
                                    ) {
                                        firstComponent = (
                                            <Navigate to={`${location.state?.from ?? "/"}`} />
                                        );
                                    }
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
                    </div>
                </AuthContext.Provider>
            </SocketContext.Provider>
        </ConfigProvider>
    );
}

export default App;
