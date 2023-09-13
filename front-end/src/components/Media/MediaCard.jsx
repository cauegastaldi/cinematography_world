import { useState } from "react";
import { Button, ButtonGroup, Card, Container, Fade, Image, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import MediaService from "../../api/MediaService";
import styles from "../../styles/HomePage/MediaCard.module.css";
import modalStyles from "../../styles/HomePage/RemoveModal.module.css";
import "../../styles/Modal/ModalContent.css";

const MediaCard = ({ media, userType, loadData }) => {
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const navigate = useNavigate();

	const handleMediaDeletion = async () => {
		await MediaService.removeMedia(media.id);
		loadData();
	};

	return (
		<>
			<Card
				onMouseOver={() => setOpen(true)}
				onMouseOut={() => setOpen(false)}
				className={`${styles.mediaCard} border-0 rounded-0`}
			>
				<Image
					src={`http://localhost:8000${media.posterPath}`}
					className={styles.mediaPoster}
					onClick={() => {
						window.location.href = `/reviews/${media.id}`;
					}}
				/>

				<Card.ImgOverlay style={{ pointerEvents: "none" }}>
					{userType === "ADMIN" && (
						<Fade
							in={open}
							timeout={0.3}
						>
							<div
								id="buttons"
								style={{ color: "white" }}
								className="mx-auto"
							>
								<ButtonGroup vertical>
									<button
										className={`btn ${styles.btn} btn-primary text-uppercase fw-bold rounded-3 mb-2`}
										style={{ pointerEvents: "auto" }}
										onClick={() => {
											navigate(`/media/edit/${media.id}`);
										}}
									>
										Editar
									</button>
									<button
										className={`btn ${styles.btn} btn-danger text-uppercase fw-bold rounded-3`}
										style={{ pointerEvents: "auto" }}
										onClick={() => handleShow()}
									>
										Excluir
									</button>
								</ButtonGroup>
							</div>
						</Fade>
					)}
				</Card.ImgOverlay>
			</Card>

			<Modal
				show={show}
				onHide={handleClose}
			>
				<Container>
					<Modal.Header className={modalStyles.modalHeader}>
						<Modal.Title className={modalStyles.modalTitle}>
							Confirmar Exclusão
						</Modal.Title>
						<button
							type="button"
							className="btn-close btn-close-white"
							data-bs-dismiss="modal"
							aria-label="Close"
							onClick={() => handleClose()}
						></button>
					</Modal.Header>
					<Modal.Body className={modalStyles.modalBody}>
						Tem certeza de que deseja excluir a midia? A ação não poderá ser desfeita!
					</Modal.Body>
					<Modal.Footer className={modalStyles.modalFooter}>
						<Button
							variant="secondary"
							onClick={handleClose}
							className={modalStyles.modalBtn}
						>
							Cancelar
						</Button>
						<Button
							variant="danger"
							onClick={() => {
								handleMediaDeletion();
							}}
							className={modalStyles.modalBtn}
						>
							Excluir
						</Button>
					</Modal.Footer>
				</Container>
			</Modal>
		</>
	);
};

export default MediaCard;
