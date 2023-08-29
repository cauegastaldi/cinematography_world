import { useEffect, useState } from "react";
import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import AuthService from "../api/AuthService";

import "../styles/NavBar.css";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
	const auth = useAuth();
	const user = auth.user;

	const userType = user?.userType;

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
						{!user && (
							<LinkContainer to={"/login"}>
								<Nav.Link className="link">Login</Nav.Link>
							</LinkContainer>
						)}

						<LinkContainer to={"/"}>
							<Nav.Link className="link">Filmes e Séries</Nav.Link>
						</LinkContainer>
						{userType === "ADMIN" && (
							<LinkContainer to={"/media/create"}>
								<Nav.Link className="link">Cadastrar Mídia</Nav.Link>
							</LinkContainer>
						)}

						{userType === "ADMIN" && (
							<LinkContainer to={"/user/register"}>
								<Nav.Link className="link">Criar Administrador</Nav.Link>
							</LinkContainer>
						)}
						{userType === "ADMIN" && (
							<LinkContainer to={"/user/listUsers"}>
								<Nav.Link className="link">Listar Usuários</Nav.Link>
							</LinkContainer>
						)}

						{user && (
							<NavDropdown
								id="dropdown"
								title="Meu Perfil"
								menuVariant="dark"
							>
								<LinkContainer to={`/user/edit/${user?.userId}/username`}>
									<NavDropdown.Item>Alterar Username</NavDropdown.Item>
								</LinkContainer>

								<LinkContainer to={`/user/edit/${user?.userId}/password`}>
									<NavDropdown.Item>Alterar Senha</NavDropdown.Item>
								</LinkContainer>
							</NavDropdown>
						)}

						{user && (
							<Nav.Link
								onClick={() => {
									logout();
								}}
								className="link"
							>
								Sair
							</Nav.Link>
						)}
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};

export default NavBar;
