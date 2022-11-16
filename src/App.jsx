import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ViewRoutes from "./routes";

const queryClient = new QueryClient();

function App() {
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
