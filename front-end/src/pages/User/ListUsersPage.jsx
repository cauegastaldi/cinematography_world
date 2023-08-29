import Table from "react-bootstrap/Table";
import { useLoaderData, useNavigate } from "react-router-dom";
import "../../styles/ListUserPage.css";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import UserService from "../../api/UserService";

const ListUsersPage = () => {
	const auth = useAuth();
	const userType = auth.user?.userType;
	const users = useLoaderData();

	const navigate = useNavigate();

	const handleUserDeletion = async (id) => {
		await UserService.removeUser(id);
	};

	useEffect(() => {
		if (userType !== "ADMIN") {
			navigate("/");
		}
	});

	return (
		<Table
			bordered
			responsive
			hover
			variant="dark"
		>
			<thead>
				<tr>
					<th>ID</th>
					<th>USERNAME</th>
					<th>TIPO DE USUÁRIO</th>
					<th>AÇÃO</th>
				</tr>
			</thead>
			<tbody>
				{users.map((user) => {
					return (
						<tr>
							<td>{user.id}</td>
							<td>{user.username}</td>
							<td>{(user.userType === "ADMIN" && "Administrador") || "Normal"}</td>
							<td>
								<button
									className="btn btn-remove-user btn-danger text-uppercase fw-bold"
									onClick={() => {
										handleUserDeletion(user.id);
									}}
								>
									Excluir
								</button>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};

export default ListUsersPage;
