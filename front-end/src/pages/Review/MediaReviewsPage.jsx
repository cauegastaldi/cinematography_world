import { useLoaderData } from "react-router-dom";
import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import ReviewModal from "../../components/Review/ReviewModal";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ReviewService from "../../api/ReviewService";
import UserReview from "../../components/User/UserReview";
import styles from "../../styles/MediaReviewsPage/MediaReviewsPage.module.css";
import noReviewsCardStyles from "../../styles/MediaReviewsPage/NoReviewsCard.module.css";
import ReactPlayer from "react-player";

const MediaReviewsPage = () => {
	const media = useLoaderData();
	const mediaId = media.id;
	const { user } = useAuth();
	const [modalShow, setModalShow] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [userHasReview, setUserHasReview] = useState(false);

	const loadData = () => {
		ReviewService.findAllMediaReviews(mediaId, setReviews);
	};

	const findUserReview = () => {
		if (user) {
			const result = reviews.filter((review) => {
				return review.userId === user.userId;
			});
			setUserHasReview(result.length > 0);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		findUserReview();
	}, [reviews]);

	return (
		<>
			<Row
				xs={2}
				md={2}
				lg={3}
				xl={4}
				xxl={5}
			>
				<Col>
					<Card
						id="reviewMediaCard"
						className={`${styles.reviewMediaCard} border-0 rounded-0`}
					>
						<Image
							id="image"
							src={`http://localhost:8000${media.posterPath}`}
						/>
					</Card>
				</Col>
				<Col>
					<div>
						<h2 className={styles.mediaDetail}>
							{media.name} ({media.releaseYear})
						</h2>

						<p className={styles.mediaDetail}>Dirigido por {media.director}</p>
						<p className={styles.mediaDetail}>
							Gêneros: <Badge bg="secondary">{media.genre}</Badge>
						</p>
					</div>
				</Col>
				{media.trailerUrl && (
					<ReactPlayer
						url={media.trailerUrl}
						controls={true}
					/>
				)}
			</Row>

			<Row
				xs={2}
				md={2}
				lg={3}
				xl={4}
				xxl={5}
			>
				<Col className="mt-3">
					<p className={`${styles.header} fw-bold`}>Análises</p>
					{user && !userHasReview && (
						<Button
							variant="primary"
							onClick={() => setModalShow(true)}
							className={styles.publishBtn}
						>
							PUBLICAR
						</Button>
					)}
					<ReviewModal
						show={modalShow}
						onHide={() => setModalShow(false)}
						media={media}
						loadData={loadData}
					/>
				</Col>
			</Row>

			{reviews.length === 0 && (
				<>
					<Row
						xs={1}
						className="g-4 mt-2"
					>
						<Col>
							<Card className={noReviewsCardStyles.card}>
								<Card.Body>
									<Card.Title
										className={`${noReviewsCardStyles.header} text-center fs-5 fw-normal pt-3`}
									>
										Ainda não há análises desta mídia
									</Card.Title>
									<Card.Text className="text-center text-secondary p-4">
										{(user && (
											<span>
												Você pode escrever a sua análise desta mídia para
												compartilhar a sua experiência com a comunidade. Use
												o botão da área acima nesta página para escrevê-la.
											</span>
										)) || (
											<span>
												Você pode escrever a sua análise desta mídia para
												compartilhar a sua experiência com a comunidade.
												Faça login e use o botão da área acima nesta página
												para escrevê-la.
											</span>
										)}
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</>
			)}

			<Row className="mt-2">
				{reviews.map((review) => {
					return (
						<Col
							xs={12}
							className="p-0"
						>
							<UserReview
								review={review}
								media={media}
								loadData={loadData}
							/>
							<hr className={styles.divider} />
						</Col>
					);
				})}
			</Row>
		</>
	);
};

export default MediaReviewsPage;
