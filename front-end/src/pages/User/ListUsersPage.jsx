import Table from "react-bootstrap/Table";
import { useLoaderData } from "react-router-dom";
import styles from "../../styles/ListUserPage.module.css";
import React, { useState } from "react";
import UserService from "../../api/UserService";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

const renderTooltip = (props) => (
	<Tooltip
		id="button-tooltip"
		{...props}
	>
		Opções
	</Tooltip>
);

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
	<a
		href=""
		ref={ref}
		onClick={(e) => {
			e.preventDefault();
			onClick(e);
		}}
		className={`${styles.dropdownToggle}`}
	>
		<OverlayTrigger
			trigger={"hover"}
			overlay={renderTooltip}
			rootClose={true}
		>
			<i class="bi bi-three-dots-vertical"></i>
		</OverlayTrigger>
	</a>
));

const ListUsersPage = () => {
	const [users, setUsers] = useState(useLoaderData());

	const handleUserDeletion = async (id) => {
		await UserService.removeUser(id);
		const updatedList = users.filter((user) => {
			return user.id !== id;
		});
		setUsers(updatedList);
	};

	return (
		<Table
			responsive
			hover
			variant="dark"
			striped
			className={styles.table}
		>
			<thead>
				<tr className={styles.tableHeader}>
					<th>Id</th>
					<th>Username</th>
					<th>Tipo de usuário</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{users.map((user) => {
					return (
						<tr className={styles.row}>
							<td>{user.id}</td>
							<td>{user.username}</td>
							<td>{(user.userType === "ADMIN" && "Administrador") || "Normal"}</td>
							<td>
								<Dropdown>
									<Dropdown.Toggle
										as={CustomToggle}
										id="dropdown-custom-component"
									/>

									<Dropdown.Menu variant="dark">
										<Dropdown.Item
											onClick={() => {
												handleUserDeletion(user.id);
											}}
										>
											<i className="bi bi-trash3 mx-1" /> Excluir
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};

export default ListUsersPage;
