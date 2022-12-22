/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ViewRoutes from "./routes";
import { getToken } from "./auth";
import "./App.css";
import AuthContext from "./components/contexts/auth_context";

const queryClient = new QueryClient();

function App() {
    const location = useLocation();
    // localStorage.clear();
    const accessToken = getToken();
    console.log(`accessToken ${accessToken}`);
    const [isInitialWeb, setIsInitialWeb] = useState(true);
    const [user, setUser] = useState(null);

    const listAuthPage = ["/login", "/register", "/forgot_password"];

    const userFromLocalStorage = JSON.parse(localStorage.getItem("userData"));
    if (isInitialWeb) {
        if (accessToken !== null) {
            setUser({ ...userFromLocalStorage });
        }
        setIsInitialWeb(false);
    }

    const authContextValue = useMemo(() => ({
        user,
        setUser
    }));

    return (
        <AuthContext.Provider value={authContextValue}>
            <div className="pb-5 h-screen">
                <QueryClientProvider client={queryClient}>
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
                </QueryClientProvider>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
