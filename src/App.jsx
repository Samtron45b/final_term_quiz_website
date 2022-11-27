import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import jwtDecode from "jwt-decode";
import ViewRoutes from "./routes";
import "./App.css";

const queryClient = new QueryClient();

function App() {
    const [user, setUser] = useState(null);

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
        <div className="pb-5">
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        {ViewRoutes.map(({ path, exact, component }, key) => {
                            const routeKey = `route${key}`;
                            const accessToken = localStorage.getItem("accessToken");
                            let firstComponent = component;
                            if ((path === "/login" || path === "/register") && accessToken) {
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
    );
}

export default App;
