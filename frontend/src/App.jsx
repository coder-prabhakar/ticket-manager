import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import AppRoute from "./routes/AppRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard";
import Tickets from "./components/tickets/Ticket";
import Reports from "./components/reports";
import Members from "./components/members";
import Customers from "./components/customers";
import Projects from './components/projects';
import Contacts from "./components/contacts";

const router = createBrowserRouter([
    { path: "/login", element: <Login /> },

    { path: "/", element: <Navigate to="/dashboard" replace /> },
    { path: "*", element: <Navigate to="/dashboard" replace /> },

    {
        element: <AppRoute/>,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            // { path: "/reports", element: <Reports /> },
            { path: "/tickets", element: <Tickets /> },

            {
                element: <ProtectedRoute allowedRoles={["admin"]} />,
                children: [
                    { path: "/members", element: <Members /> },
                    { path: "/customers", element: <Customers /> },
                    { path: "/projects", element: <Projects /> },
                ]
            },

            {
                element: <ProtectedRoute allowedRoles={["admin", "customer"]} />,
                children: [
                    { path: "/contacts", element: <Contacts /> },
                ]
            }
        ],
    }
]);

const queryClient = new QueryClient();

export default function AppRoutes() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
};