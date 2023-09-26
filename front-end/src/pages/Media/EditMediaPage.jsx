import { useLoaderData } from "react-router-dom";
import "../../styles/Form.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MediaService from "../../api/MediaService";
import FileValidator from "../../utils/FileValidator";

const EditMediaPage = () => {
	const media = useLoaderData();
	const [acceptedTypes] = useState(FileValidator.acceptedTypes);

	const schema = yup.object({
		name: yup.string().required("Por favor, insira um nome"),
		releaseYear: yup
			.number()
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
		mediaPoster: yup.lazy((value) => {
			if (value.length !== 0) {
				return yup
					.mixed()
					.test(
						"is-valid-type",
						"Por favor, envie uma imagem com um tipo válido",
						(file) => {
							return (
								file.length > 0 &&
								FileValidator.isValidFileType(
									file && file[0].name.toLowerCase(),
									"image"
								)
							);
						}
					);
			}
			return yup.mixed().notRequired();
		}),
	});

	const form = useForm({
		defaultValues: {
			name: media ? media.name : "",
			releaseYear: media ? media.releaseYear : "",
			genre: media ? media.genre : "",
			director: media ? media.director : "",
			trailerUrl: media ? media.trailerUrl : "",
		},
		resolver: yupResolver(schema),
	});

	const { register, handleSubmit, formState, setError } = form;
	const { errors } = formState;

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		let uploadResponse = null;
		if (data.mediaPoster[0]) {
			const formData = new FormData();
			formData.append("mediaPoster", data.mediaPoster[0]);
			uploadResponse = await MediaService.uploadMediaPoster(formData);
		}
		if (uploadResponse?.errors) {
			setError("editMedia", { message: uploadResponse.errors.payload });
		} else {
			await MediaService.updateMedia(media.id, {
				name: data.name,
				releaseYear: data.releaseYear,
				genre: data.genre,
				director: data.director,
				posterPath: uploadResponse ? uploadResponse : null,
				trailerUrl: data.trailerUrl,
			});
			navigate("/");
		}
	};

	useEffect(() => {
		if (media == null) {
			navigate("/");
		}
	}, []);

	return (
		<>
			<div className="row">
				<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
					<div className="card border-0 shadow rounded-3 my-5">
						<div className="card-body p-4 p-sm-5">
							<h5 className="card-title text-center mb-5 ">Editar Mídia</h5>
							{errors.editMedia && (
								<div className="card text-white bg-dark shadow rounded-1 my-4">
									<div className="card-body p-3">
										<p
											className="card-text"
											style={{ fontSize: "0.9em" }}
										>
											{errors?.editMedia?.message}
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

								<div className="form-floating mb-3">
									<input
										{...register("trailerUrl")}
										type="text"
										className="form-control"
										id="trailerUrl"
										placeholder="trailerUrl"
									/>
									<label for="trailerUrl">URL do trailer (Opcional)</label>
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

									<small className="fw-light">
										Tipos aceitos: {acceptedTypes}
										<br />
										Tamanho máximo: {FileValidator.maxFileSizeInMb()}
									</small>
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
	return "Página de edição...";
};

export default EditMediaPage;
