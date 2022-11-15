import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewRoutes from "./routes";

function App() {
    return (
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
    );
}

export default App;
