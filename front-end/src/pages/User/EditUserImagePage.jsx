import "../../styles/Form.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserService from "../../api/UserService";
import { useEffect } from "react";
import FileValidator from "../../utils/FileValidator";
import ImageResizer from "../../utils/ImageResizer";

const EditUserImagePage = () => {
	const user = useLoaderData();
	const auth = useAuth();
	const loggedUser = auth.user;

	const schema = yup.object({
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
		try {
			let uploadResponse = null;
			if (data.userImage[0]) {
				const formData = new FormData();
				const image = await ImageResizer.resizeImage(data.userImage[0]);
				formData.append("userImage", image);
				uploadResponse = await UserService.uploadUserImage(formData);
				if (uploadResponse.errors) {
					setError("responseFeedback", { message: uploadResponse.errors.payload });
					return;
				}
			}

			await UserService.updateUser(user.id, { imagePath: uploadResponse });
			await auth.refreshData({
				userImage: uploadResponse ? uploadResponse : "/defaultImage/defaultUserImage.png",
			});
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
							<h5 className="card-title text-center mb-5 ">
								Editar Imagem de Perfil
							</h5>

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

export default EditUserImagePage;
