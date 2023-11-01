import { Button, Image, Modal, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import AuthService from "../api/AuthService";

import "../styles/NavBar.css";
import modalStyles from "../styles/HomePage/RemoveModal.module.css";
import "../styles/Modal/ModalContent.css";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import UserService from "../api/UserService";

const NavBar = () => {
	const auth = useAuth();
	const user = auth.user;
	const [show, setShow] = useState(false);

	const userType = user?.userType;

	const logout = async () => {
		await AuthService.logout();
		auth.logout();
	};

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleAccountDeletion = async (id) => {
		await UserService.removeUser(id);
		await logout();
		handleClose();
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
							<LinkContainer to={"/user/favoritesMedias"}>
								<Nav.Link className="link">Meus favoritos</Nav.Link>
							</LinkContainer>
						)}

						{user && (
							<NavDropdown
								id="dropdown"
								title="Meu Perfil"
								menuVariant="dark"
							>
								<NavDropdown.Item id="usernameNavbar">
									<Image
										src={`http://localhost:8000${user?.userImage}`}
										roundedCircle
										width="35px"
										height="35px"
										style={{ marginRight: "0.5em" }}
									/>
									{user?.username}
								</NavDropdown.Item>
								<LinkContainer to={`/user/edit/${user?.userId}/username`}>
									<NavDropdown.Item>Alterar Username</NavDropdown.Item>
								</LinkContainer>

								<LinkContainer to={`/user/edit/${user?.userId}/userImage`}>
									<NavDropdown.Item>Alterar Imagem de Perfil</NavDropdown.Item>
								</LinkContainer>

								<LinkContainer to={`/user/edit/${user?.userId}/password`}>
									<NavDropdown.Item>Alterar Senha</NavDropdown.Item>
								</LinkContainer>

								<NavDropdown.Item onClick={() => handleShow()}>
									Excluir Conta
								</NavDropdown.Item>
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

			<Modal
				show={show}
				onHide={handleClose}
			>
				<Container>
					<Modal.Header className={modalStyles.modalHeader}>
						<Modal.Title className={modalStyles.modalTitle}>
							Confirmar Exclusão
						</Modal.Title>
						<button
							type="button"
							className="btn-close btn-close-white"
							data-bs-dismiss="modal"
							aria-label="Close"
							onClick={() => handleClose()}
						></button>
					</Modal.Header>
					<Modal.Body className={modalStyles.modalBody}>
						Tem certeza de que deseja excluir a conta? A ação não poderá ser desfeita e
						a conta não poderá ser recuperada!
					</Modal.Body>
					<Modal.Footer className={modalStyles.modalFooter}>
						<Button
							variant="secondary"
							onClick={handleClose}
							className={modalStyles.modalBtn}
						>
							Cancelar
						</Button>
						<Button
							variant="danger"
							onClick={() => {
								handleAccountDeletion(user?.userId);
							}}
							className={modalStyles.modalBtn}
						>
							Excluir
						</Button>
					</Modal.Footer>
				</Container>
			</Modal>
		</>
	);
};

export default NavBar;
