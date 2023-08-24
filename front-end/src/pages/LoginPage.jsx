import "../styles/Form.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../api/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
	const auth = useAuth();

	const schema = yup.object({
		username: yup.string().required("Por favor, insira um username"),
		password: yup.string().required("Por favor, insira uma senha"),
	});

	const form = useForm({
		resolver: yupResolver(schema),
	});

	const { register, handleSubmit, formState, setError } = form;
	const { errors } = formState;

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		const username = data.username;
		const password = data.password;
		try {
			const response = await AuthService.login(username, password);
			if (response.errors) {
				setError("login", { message: "Usuário ou senha inválidos" });
			} else {
				//localStorage.setItem("isLogged", true);
				auth.login({
					userId: response.userId,
					username: response.username,
					userType: response.userType,
				});
				navigate("/");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const isLogged = auth.user ? true : false;
		if (isLogged == true) {
			navigate("/");
		}
	}, []);

	return (
		<>
			<div className="container">
				<div className="row">
					<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
						<div className="card border-0 shadow rounded-3 my-5">
							<div className="card-body p-4 p-sm-5">
								<h5 className="card-title text-center mb-5">Login</h5>
								{errors.login && (
									<div className="card text-white bg-dark shadow rounded-1 my-4">
										<div className="card-body p-3">
											<p
												className="card-text"
												style={{ fontSize: "0.9em" }}
											>
												{errors?.login?.message}
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
											{...register("username")}
											required
											type="text"
											className={`form-control ${
												errors.username ? "is-invalid" : ""
											}`}
											id="username"
											placeholder="username"
										/>
										<label for="username">Username</label>
										<div className="invalid-feedback">
											{errors.username && (
												<span>{errors.username.message}</span>
											)}
										</div>
									</div>
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
											{errors.password && (
												<span>{errors.password.message}</span>
											)}
										</div>
									</div>

									<div className="d-grid">
										<button
											className="btn btn-primary btn-login text-uppercase fw-bold"
											type="submit"
										>
											Login
										</button>
									</div>
									<hr className="my-4" />
									<div className="row">
										<p>
											Não tem uma conta?{" "}
											<Link to={"/user/register"}>Registre-se</Link>
										</p>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
