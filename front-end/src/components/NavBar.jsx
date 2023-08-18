import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useCookies } from "react-cookie";
import AuthService from "../api/AuthService";
import { useAuth } from "../hooks/useAuth";
import "../styles/NavBar.css";
import { LinkContainer } from "react-router-bootstrap";

const NavBar = () => {
	const auth = useAuth();
	const [isUserLogged, setIsUserLogged] = useState(auth.user);
	const userType = auth.user?.userType;

	const logout = async () => {
		await AuthService.logout();
		auth.logout();
		setIsUserLogged(false);
	};

	return (
		<>
			<Navbar className="navbar">
				<Container>
					<Nav className="me-auto">
						{!isUserLogged && (
							<LinkContainer to={"/login"}>
								<Nav.Link className="link">
									<b>Login</b>
								</Nav.Link>
							</LinkContainer>
						)}
						{!isUserLogged && (
							<LinkContainer to={"/user/register"}>
								<Nav.Link className="link">
									<b>Criar Conta</b>
								</Nav.Link>
							</LinkContainer>
						)}
						<LinkContainer to={"/"}>
							<Nav.Link className="link">
								<b>Filmes e Séries</b>
							</Nav.Link>
						</LinkContainer>
						{userType === "ADMIN" && (
							<LinkContainer to={"/media/create"}>
								<Nav.Link className="link">
									<b>Cadastrar Mídia</b>
								</Nav.Link>
							</LinkContainer>
						)}

						{userType === "ADMIN" && (
							<LinkContainer to={"/user/register"}>
								<Nav.Link className="link">
									<b>Criar Administrador</b>
								</Nav.Link>
							</LinkContainer>
						)}
						{userType === "ADMIN" && (
							<LinkContainer to={"/user/listUsers"}>
								<Nav.Link className="link">
									<b>Listar Usuários</b>
								</Nav.Link>
							</LinkContainer>
						)}
						{isUserLogged && (
							<Nav.Link
								onClick={() => {
									logout();
								}}
								className="link"
							>
								<b>Sair</b>
							</Nav.Link>
						)}
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};

export default NavBar;
