import "../../styles/Form.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import UserService from "../../api/UserService";
import FileValidator from "../../utils/FileValidator";
import ImageResizer from "../../utils/ImageResizer";

const CreateAccountPage = () => {
	const auth = useAuth();
	const userType = auth.user?.userType;

	const schema = yup.object({
		username: yup.string().required("Por favor, insira um username"),
		password: yup.string().required("Por favor, insira uma senha"),
		userImage: yup
			.mixed()
			.optional()
			.test("is-valid-type", "Por favor, envie uma imagem com um tipo válido", (file) => {
				if (file.length > 0) {
					return FileValidator.isValidFileType(
						file && file[0].name.toLowerCase(),
						"image"
					);
				} else {
					return true;
				}
			}),
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
		console.log(!data.userImage[0]);
		try {
			const response = await UserService.findUserByName(username);
			if (!response.errors) {
				setError("createAccount", { message: "Username já está sendo utilizado" });
			} else {
				let uploadResponse = null;
				if (data.userImage[0]) {
					const formData = new FormData();
					const image = await ImageResizer.resizeImage(data.userImage[0]);
					formData.append("userImage", image);
					uploadResponse = await UserService.uploadUserImage(formData);
					if (uploadResponse.errors) {
						setError("createAccount", { message: uploadResponse.errors.payload });
						return;
					}
				}
				if (userType !== "ADMIN") {
					await UserService.createNormalUser({
						username: username,
						password: password,
						imagePath: uploadResponse,
					});
					navigate("/login");
				} else {
					await UserService.createAdminUser({
						username: username,
						password: password,
						imagePath: uploadResponse,
					});
					navigate("/");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const isLogged = auth.user ? true : false;
		if (isLogged == true && userType !== "ADMIN") {
			navigate("/");
		}
	}, []);

	return (
		<>
			<div className="row">
				<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
					<div className="card border-0 shadow rounded-3 my-5">
						<div className="card-body p-4 p-sm-5">
							<h5 className="card-title text-center mb-5 ">
								{userType !== "ADMIN" && <span>Criar Conta</span>}
								{userType === "ADMIN" && <span>Criar Administrador</span>}
							</h5>
							{errors.createAccount && (
								<div className="card text-white bg-dark shadow rounded-1 my-4">
									<div className="card-body p-3">
										<p
											className="card-text"
											style={{ fontSize: "0.9em" }}
										>
											{errors?.createAccount?.message}
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
										{errors.username && <span>{errors.username.message}</span>}
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
										{errors.password && <span>{errors.password.message}</span>}
									</div>
								</div>

								<div className="mb-3">
									<label
										for="mediaPoster"
										className="form-label ps-1"
									>
										Imagem de Perfil (Opcional)
									</label>
									<input
										{...register("userImage")}
										required
										type="file"
										className={`form-control ${
											errors.userImage ? "is-invalid" : ""
										}`}
										id="userImage"
										name="userImage"
										placeholder="userImage"
									/>

									<div className="invalid-feedback">
										{errors.userImage && (
											<span>{errors.userImage.message}</span>
										)}
									</div>
								</div>

								<div className="d-grid mb-2">
									<button
										className="btn btn-primary btn-login text-uppercase fw-bold"
										type="submit"
									>
										Cadastrar
									</button>
								</div>
								<div className="d-grid mb-2">
									<button
										className="btn btn-primary btn-danger text-uppercase fw-bold"
										onClick={() => {
											if (userType === "ADMIN") {
												navigate("/");
											} else {
												navigate("/login");
											}
										}}
									>
										Voltar
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

export default CreateAccountPage;
