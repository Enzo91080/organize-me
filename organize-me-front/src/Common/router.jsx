import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "../Home/Home";
import Tasks from "../Tasks/Tasks";
import Login from "../Auth/Login";
import TasksPage from "../Tasks/TasksPage";

export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },
  HOME: "/",
  TASKS: "/tasks",
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { 
        path: ROUTES.TASKS, 
        element: (<TasksPage />), 
      },
      { path: ROUTES.AUTH.LOGIN, element: <Login /> },
    ],
  },
]);

export default router;
