import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "../Home/Home";
import Tasks from "../Tasks/Tasks";
import Login from "../Auth/Login";
import TasksPage from "../Tasks/TasksPage";
import Register from "../Auth/Register";

export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
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
      { path: ROUTES.AUTH.REGISTER, element: <Register /> },


    ],
  },
]);

export default router;
