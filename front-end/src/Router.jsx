import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./layouts/Layout";
import CreateAccountPage from "./pages/User/CreateAccountPage";
import CreateMediaPage from "./pages/Media/CreateMediaPage";
import ListUsersPage from "./pages/User/ListUsersPage";
import HomePage from "./pages/HomePage";
import MediaService from "./api/MediaService";
import EditMediaPage from "./pages/Media/EditMediaPage";

import UserService from "./api/UserService";
import EditUserUsernamePage from "./pages/User/EditUserUsernamePage";
import EditUserPasswordPage from "./pages/User/EditUserPasswordPage";
import MediaReviewsPage from "./pages/Review/MediaReviewsPage";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import FavoritesMedias from "./pages/Media/FavoritesMedias";

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

					{
						path: "edit/:id",
						children: [
							{
								path: "username",
								element: (
									<ProtectedRoute>
										<EditUserUsernamePage />
									</ProtectedRoute>
								),
								loader: async ({ params }) => {
									return await UserService.findUserById(params.id);
								},
							},
							{
								path: "password",
								element: (
									<ProtectedRoute>
										<EditUserPasswordPage />
									</ProtectedRoute>
								),
								loader: async ({ params }) => {
									return await UserService.findUserById(params.id);
								},
							},
						],
					},
				],
			},
			{
				path: "media",
				children: [
					{
						path: "create",
						element: (
							<ProtectedRoute isAdminRoute>
								<CreateMediaPage />
							</ProtectedRoute>
						),
					},
					{
						path: "edit/:id",
						element: (
							<ProtectedRoute isAdminRoute>
								<EditMediaPage />
							</ProtectedRoute>
						),
						loader: async ({ params }) => {
							return await MediaService.findOneMedia(params.id);
						},
					},
				],
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
				children: [
					{
						path: "listUsers",
						element: (
							<ProtectedRoute isAdminRoute>
								<ListUsersPage />
							</ProtectedRoute>
						),
						loader: async () => {
							const users = await UserService.findAllUsers();
							if (!users) return [];
							return users;
						},
					},
					{
						path: "favoritesMedias",
						element: <FavoritesMedias />,
					},
				],
			},
			{
				path: "reviews/:mediaId",
				element: <MediaReviewsPage />,
				loader: async ({ params }) => {
					return await MediaService.findOneMedia(params.mediaId);
				},
			},
		],
	},
]);

export default Router;
