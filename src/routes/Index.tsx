import {
    createBrowserRouter,
} from "react-router-dom";

import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        path: "/",
        element: <DashboardPage />,
    },
]);