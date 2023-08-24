import "../../styles/Form.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserService from "../../api/UserService";
import { useEffect } from "react";

const EditUserPasswordPage = () => {
	const user = useLoaderData();
	const auth = useAuth();
	const loggedUser = auth.user;

	const schema = yup.object({
		password: yup.string().required("Por favor, insira uma senha"),
	});

	const form = useForm({
		resolver: yupResolver(schema),
	});

	const { register, handleSubmit, formState, setError } = form;
	const { errors } = formState;

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		const password = data.password;

		try {
			await UserService.updateUser(user.id, { password: password });
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (user.id !== loggedUser.userId) {
			navigate("/");
		}
	}, []);

	return (
		<>
			<div className="row">
				<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
					<div className="card border-0 shadow rounded-3 my-5">
						<div className="card-body p-4 p-sm-5">
							<h5 className="card-title text-center mb-5 ">Editar senha</h5>

							{errors.responseFeedback && (
								<div className="card text-white bg-dark shadow rounded-1 my-4">
									<div className="card-body p-3">
										<p
											className="card-text"
											style={{ fontSize: "0.9em" }}
										>
											{errors?.responseFeedback?.message}
										</p>
									</div>
								</div>
							)}
							<form
								noValidate
								onSubmit={handleSubmit(onSubmit)}
							>
								<div className="form-floating mb-3">
									<input
										{...register("password")}
										required
										type="password"
										className={`form-control ${
											errors.password ? "is-invalid" : ""
										}`}
										id="password"
										placeholder="senha"
									/>
									<label for="password">Senha</label>
									<div className="invalid-feedback">
										{errors.password && <span>{errors.password.message}</span>}
									</div>
								</div>

								<div className="d-grid mb-2">
									<button
										className="btn btn-primary btn-login text-uppercase fw-bold"
										type="submit"
									>
										Salvar
									</button>
								</div>
								<div className="d-grid mb-2">
									<button
										className="btn btn-primary btn-danger text-uppercase fw-bold"
										onClick={() => {
											navigate("/");
										}}
									>
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditUserPasswordPage;
