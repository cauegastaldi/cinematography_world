import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import "../../styles/Modal/ModalContent.css";
import styles from "../../styles/Modal/ReviewCommentModal.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReviewService from "../../api/ReviewService";
import { useState } from "react";
import CommentProgress from "../ProgressBar/CommentProgress";

const ReviewCommentModal = (props) => {
	const reviewComment = props.reviewComment;
	const review = props.review;
	const reviewUser = props.reviewUser;
	const [commentProgress, setCommentProgress] = useState(
		reviewComment ? reviewComment.comment.length : 0
	);

	const schema = yup.object({
		comment: yup
			.string()
			.max(255, "O comentário deve ter até 255 caracteres")
			.required("Por favor, digite o seu comentário"),
	});

	const form = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			comment: reviewComment?.comment,
		},
	});

	const { register, handleSubmit, formState, reset, setError } = form;
	const { errors } = formState;

	const closeModal = () => {
		reset();
		setCommentProgress(reviewComment ? reviewComment.comment.length : 0);
		props.onHide();
	};

	const onSubmit = async (data) => {
		const comment = data.comment;

		try {
			let response;
			if (reviewComment) {
				response = await ReviewService.updateReviewComment(reviewComment.id, {
					comment: comment,
				});
			} else {
				response = await ReviewService.commentReview(review.id, {
					comment: comment,
				});
			}
			if (response.errors) {
				setError("responseFeedback", { message: response.errors.errorData });
			} else {
				if (reviewComment) {
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

	return (
		<Modal
			{...props}
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="reviewForm"
			centered
		>
			<Container>
				<button
					type="button"
					className={`btn-close btn-close-white ${styles.closeBtn}`}
					data-bs-dismiss="modal"
					aria-label="Close"
					onClick={props.onHide}
				/>
				<Modal.Header className={styles.modalHeader}>
					<Row>
						<Col
							xs={12}
							className={`mb-2 ${styles.username}`}
						>
							<span>{reviewUser}</span>
						</Col>
						<Col>
							<span>{review.comment}</span>
						</Col>
					</Row>
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
										placeholder="Digite o seu comentário"
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

export default ReviewCommentModal;
