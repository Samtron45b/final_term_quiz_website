import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
                    const decode = jwtDecode(resObject.accessToken, "letsplay");
                    setUser(decode);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getUser();
    }, []);

    console.log(user);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    {ViewRoutes.map(({ path, exact, component }, key) => {
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <Route key={key} exact={exact} path={path} element={component} />
                        );
                    })}
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
