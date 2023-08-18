import "../styles/Form.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../api/AuthService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import UserService from "../api/UserService";
import MediaService from "../api/MediaService";

const CreateMediaPage = () => {
	const auth = useAuth();
	const userType = auth.user?.userType;

	const schema = yup.object({
		name: yup.string().required("Por favor, insira um nome"),
		releaseYear: yup
			.number("Ano de lançamento deve ser um número")
			.transform((value) => (Number.isNaN(value) ? null : value))
			.positive("Ano de lançamento deve ser um número positivo")
			.integer("Ano de lançamento deve ser um número inteiro")
			.test(
				"len",
				"Ano de lançamento deve possuir 4 digitos",
				(val) => val.toString().length === 4
			)
			.required("Por favor, insira o ano de lançamento"),
		genre: yup.string().required("Por favor, insira o(s) gênero(s)"),
		director: yup.string().required("Por favor, insira o nome do(s) diretor(es)"),
		mediaPoster: yup
			.mixed()
			.test("required", "Por favor, envie uma imagem para ser o pôster da midia", (file) => {
				if (file.length > 0) return true;
				return false;
			}),
	});

	const form = useForm({
		resolver: yupResolver(schema),
	});

	const { register, handleSubmit, formState, setError } = form;
	const { errors } = formState;

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		const formData = new FormData();
		formData.append("mediaPoster", data.mediaPoster[0]);
		const uploadResponse = await MediaService.uploadMediaPoster(formData);
		if (uploadResponse.errors) {
			setError("createMedia", { message: uploadResponse.errors.payload });
		} else {
			console.log(uploadResponse);
			const createResponse = await MediaService.createMedia({
				name: data.name,
				releaseYear: data.releaseYear,
				genre: data.genre,
				director: data.director,
				posterPath: uploadResponse,
			});
		}
	};

	useEffect(() => {
		if (userType !== "ADMIN") {
			navigate("/");
		}
	}, []);

	return (
		<>
			<div className="row">
				<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
					<div className="card border-0 shadow rounded-3 my-5">
						<div className="card-body p-4 p-sm-5">
							<h5 className="card-title text-center mb-5 ">Cadastrar Mídia</h5>
							{errors.createMedia && (
								<div className="card text-white bg-dark shadow rounded-1 my-4">
									<div className="card-body p-3">
										<p
											className="card-text"
											style={{ fontSize: "0.9em" }}
										>
											{errors?.createMedia?.message}
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
										{...register("name")}
										required
										type="text"
										className={`form-control ${
											errors.name ? "is-invalid" : ""
										}`}
										id="name"
										placeholder="name"
									/>
									<label for="name">Nome</label>
									<div className="invalid-feedback">
										{errors.name && <span>{errors.name.message}</span>}
									</div>
								</div>
								<div className="form-floating mb-3">
									<input
										{...register("releaseYear")}
										required
										type="number"
										onInput={(e) =>
											(e.target.value = e.target.value.slice(
												0,
												e.target.maxLength
											))
										}
										maxLength={4}
										className={`form-control ${
											errors.releaseYear ? "is-invalid" : ""
										}`}
										id="releaseYear"
										placeholder="releaseYear"
									/>
									<label for="releaseYear">Ano de Lançamento</label>
									<div className="invalid-feedback">
										{errors.releaseYear && (
											<span>{errors.releaseYear.message}</span>
										)}
									</div>
								</div>

								<div className="form-floating mb-3">
									<input
										{...register("genre")}
										required
										type="text"
										className={`form-control ${
											errors.genre ? "is-invalid" : ""
										}`}
										id="genre"
										placeholder="genre"
									/>
									<label for="genre">Gênero(s)</label>
									<div className="invalid-feedback">
										{errors.genre && <span>{errors.genre.message}</span>}
									</div>
								</div>

								<div className="form-floating mb-3">
									<input
										{...register("director")}
										required
										type="text"
										className={`form-control ${
											errors.director ? "is-invalid" : ""
										}`}
										id="director"
										placeholder="director"
									/>
									<label for="director">Diretor(es)</label>
									<div className="invalid-feedback">
										{errors.director && <span>{errors.director.message}</span>}
									</div>
								</div>

								<div className="mb-3">
									<label
										for="mediaPoster"
										className="form-label ps-1"
									>
										Pôster da Midia
									</label>
									<input
										{...register("mediaPoster")}
										required
										type="file"
										className={`form-control ${
											errors.mediaPoster ? "is-invalid" : ""
										}`}
										id="mediaPoster"
										name="mediaPoster"
										placeholder="mediaPoster"
									/>

									<div className="invalid-feedback">
										{errors.mediaPoster && (
											<span>{errors.mediaPoster.message}</span>
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

export default CreateMediaPage;
