import { Await, useOutlet, useRouteLoaderData } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import { Suspense } from "react";
import { Alert } from "react-bootstrap";

export const AuthLayout = () => {
	const outlet = useOutlet();

	const { userPromise } = useRouteLoaderData("root");

	return (
		<Suspense>
			<Await
				resolve={userPromise}
				errorElement={<Alert>Something went wrong!</Alert>}
				children={(user) => <AuthProvider userData={user}>{outlet}</AuthProvider>}
			/>
		</Suspense>
	);
};
