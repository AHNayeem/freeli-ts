import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/Login/Login";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        // element: <Home />,
        element: <Login type="normal"/>,
    },
    {
        path: "/login",
        element: <PublicRoute />, // Protects Login page
        // children: [{ path: "", element: <Login /> }],
        children: [{ path: "", element: <></> }],
    },
    {
        path: "/connect",
        element: <PrivateRoute />, // Protects Dashboard
        // children: [{ path: "", element: <Dashboard /> }],
        children: [{ path: "", element: <></> }],
    },
    {
        path: "*",
        // element: <NotFound />,
        element: <></>,
    },
]);

export default router;
