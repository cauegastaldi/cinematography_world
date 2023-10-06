import { Button, Col, Container, Form, Modal, ProgressBar, Row } from "react-bootstrap";
import "../../styles/Modal/ModalContent.css";
import styles from "../../styles/Modal/MediaReviewModal.module.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactStars from "react-rating-stars-component";
import ReviewService from "../../api/ReviewService";
import CommentProgress from "../ProgressBar/CommentProgress";

const ReviewModal = (props) => {
	const [media, setMedia] = useState(null);
	const review = props.review;
	const [rating, setRating] = useState(review ? review.mediaScore : 0);
	const [commentProgress, setCommentProgress] = useState(review ? review.comment.length : 0);

	const schema = yup.object({
		comment: yup
			.string()
			.max(255, "A análise deve ter até 255 caracteres")
			.required("Por favor, digite a sua análise"),
	});

	const form = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			comment: review ? review.comment : "",
		},
	});

	const { register, handleSubmit, formState, reset, setError } = form;
	const { errors } = formState;

	const closeModal = () => {
		reset();
		setRating(review ? review.mediaScore : 0);
		setCommentProgress(review ? review.comment.length : 0);
		props.onHide();
	};

	const onSubmit = async (data) => {
		const comment = data.comment;
		const mediaId = media.id;
		try {
			let response;
			if (review) {
				response = await ReviewService.updateReview(review.id, {
					comment: comment,
					mediaScore: rating,
					mediaId: mediaId,
				});
			} else {
				response = await ReviewService.createReview({
					comment: comment,
					mediaScore: rating,
					mediaId: mediaId,
				});
			}
			if (response.errors) {
				setError("responseFeedback", { message: response.errors.errorData });
			} else {
				if (review) {
					window.location.reload();
				} else {
					props.loadData();
					closeModal();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setMedia(props.media);
	});

	return (
		<Modal
			{...props}
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="reviewForm"
			centered
		>
			<Container>
				<Modal.Header className={styles.modalHeader}>
					<span>
						{media?.name} ({media?.releaseYear})
					</span>

					<button
						type="button"
						className="btn-close btn-close-white"
						data-bs-dismiss="modal"
						aria-label="Close"
						onClick={props.onHide}
					></button>
				</Modal.Header>

				<Form
					noValidate
					onSubmit={handleSubmit(onSubmit)}
				>
					{errors?.responseFeedback && (
						<div className="card text-white bg-dark shadow rounded-1 my-1">
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

					<Modal.Body className={styles.modalBody}>
						<Row>
							<Col
								xs={6}
								md={4}
							>
								<Form.Group
									className="mb-3"
									controlId="comment"
								>
									<Form.Control
										{...register("comment")}
										required
										as="textarea"
										className={`${styles.reviewComment} ${
											errors.comment ? "is-invalid" : ""
										} ${errors.comment && styles.textAreaError}`}
										placeholder="Digite a sua análise"
										onChange={(e) => {
											setCommentProgress(e.target.value.length);
										}}
									/>

									<div className={`invalid-feedback ${styles.error}`}>
										{errors.comment && <span>{errors.comment.message}</span>}
									</div>

									<div className="mt-2">
										<CommentProgress
											actualProgress={commentProgress}
											maxValue={255}
										/>
									</div>
								</Form.Group>

								<Form.Group
									controlId="rating"
									style={{ width: "15em" }}
								>
									<Form.Label>
										Nota da Mídia <small>{rating} de 5</small>
									</Form.Label>

									<ReactStars
										count={5}
										size={40}
										isHalf
										onChange={(e) => {
											setRating(e);
										}}
										value={review?.mediaScore}
									/>
								</Form.Group>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer className={styles.modalFooter}>
						<Button
							variant="danger"
							onClick={() => closeModal()}
							className={styles.modalBtn}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							className={styles.modalBtn}
						>
							Salvar
						</Button>
					</Modal.Footer>
				</Form>
			</Container>
		</Modal>
	);
};

export default ReviewModal;
