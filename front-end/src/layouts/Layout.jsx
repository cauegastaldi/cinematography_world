import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Container } from "react-bootstrap";
const Layout = () => {
	return (
		<>
			<NavBar />

			<Container>
				<Outlet />
			</Container>
		</>
	);
};

export default Layout;
