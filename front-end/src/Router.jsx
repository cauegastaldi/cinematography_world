import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./layouts/Layout";
import CreateAccountPage from "./pages/CreateAccountPage";
import CreateMediaPage from "./pages/CreateMediaPage";
import ListUsersPage from "./pages/ListUsersPage";
import HomePage from "./pages/HomePage";

const Router = createBrowserRouter([
	{
		element: <Layout includeNavBar={false} />,
		children: [
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "user",
				children: [
					{
						path: "register",
						element: <CreateAccountPage />,
					},
				],
			},
			{
				path: "media",
				children: [{ path: "create", element: <CreateMediaPage /> }],
			},
		],
	},

	{
		element: <Layout includeNavBar={true} />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
			{
				path: "user",
				children: [{ path: "listUsers", element: <ListUsersPage /> }],
			},
		],
	},
]);

export default Router;
