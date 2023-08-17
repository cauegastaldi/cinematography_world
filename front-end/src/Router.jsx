import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AuthService from "./api/AuthService";
import Layout from "./layouts/Layout";
import CreateAccountPage from "./pages/CreateAccountPage";

/*const response = await AuthService.verifyIfUserIsLoggedIn();
if (response.errors) {
	localStorage.setItem("isLogged", false);
} else {
	localStorage.setItem("isLogged", true);
}*/

const Router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/user/register",
		element: <CreateAccountPage />,
	},
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: "Pagina Inicial",
			},
		],
	},
]);

export default Router;
