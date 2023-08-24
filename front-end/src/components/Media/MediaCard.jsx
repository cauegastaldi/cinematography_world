import { useState } from "react";
import { Button, ButtonGroup, Card, Container, Fade, Image, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/Modal.css";
import MediaService from "../../api/MediaService";

const MediaCard = ({ media, userType }) => {
	const [open, setOpen] = useState(false);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const navigate = useNavigate();

	const handleMediaDeletion = async () => {
		await MediaService.removeMedia(media.id);
	};

	return (
		<>
			<Card
				onMouseOver={() => setOpen(true)}
				onMouseOut={() => setOpen(false)}
				className="mediaCard border-0 rounded-0"
			>
				<Image
					src={`http://localhost:8000${media.posterPath}`}
					className="mediaPoster"
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
										className="btn btn-primary text-uppercase fw-bold rounded-3 mb-2"
										style={{ pointerEvents: "auto" }}
										onClick={() => {
											navigate(`/media/edit/${media.id}`);
										}}
									>
										Editar
									</button>
									<button
										className="btn btn-danger text-uppercase fw-bold rounded-3"
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
					<Modal.Header>
						<Modal.Title>Confirmar Exclusão</Modal.Title>
						<button
							type="button"
							class="btn-close btn-close-white"
							data-bs-dismiss="modal"
							aria-label="Close"
							onClick={() => handleClose()}
						></button>
					</Modal.Header>
					<Modal.Body>
						Tem certeza de que deseja excluir a midia? A ação não poderá ser desfeita!
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							onClick={handleClose}
							className="btn-modal"
						>
							Cancelar
						</Button>
						<Button
							variant="danger"
							onClick={() => {
								handleMediaDeletion();
							}}
							className="btn-modal"
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
