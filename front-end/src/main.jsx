import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { RouterProvider } from "react-router-dom";
import "./styles/main.css";
import Router from "./Router.jsx";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "./hooks/useAuth";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<CookiesProvider>
			<AuthProvider>
				<RouterProvider router={Router} />
			</AuthProvider>
		</CookiesProvider>
	</React.StrictMode>
);
