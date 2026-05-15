import {
    createBrowserRouter,
} from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";

import ProtectedRoute from "./ProtectedRoute";

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
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
    },
]);