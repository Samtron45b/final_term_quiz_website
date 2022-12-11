/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ViewRoutes from "./routes";
import { getToken } from "./auth";
import "./App.css";
import AuthContext from "./components/contexts/auth_context";
import LocationContext from "./components/contexts/location_context";

const queryClient = new QueryClient();

function App() {
    const [location, setLocation] = useState(window.location.pathname);
    const locationContextValue = useMemo(() => ({
        location,
        setLocation
    }));
    // localStorage.clear();
    const accessToken = getToken();
    console.log(`accessToken ${accessToken}`);
    const [isInitialWeb, setIsInitialWeb] = useState(true);
    const [user, setUser] = useState(null);

    if (isInitialWeb) {
        if (accessToken !== null) {
            setUser(JSON.parse(localStorage.getItem("userData")));
        }
        setIsInitialWeb(false);
    }

    const authContextValue = useMemo(() => ({
        user,
        setUser
    }));

    return (
        <LocationContext.Provider value={locationContextValue}>
            <AuthContext.Provider value={authContextValue}>
                <div className="pb-5 h-screen">
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
                                    } else if (
                                        !path.includes("/activate_account") &&
                                        !accessToken
                                    ) {
                                        firstComponent = <Navigate to="/login" replace />;
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
            </AuthContext.Provider>
        </LocationContext.Provider>
    );
}

export default App;
