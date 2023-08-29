import { useLoaderData } from "react-router-dom";
import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import styles from "../../styles/MediaReviewsPage/MediaReviewsPage.module.css";
import ReviewModal from "../../components/Review/ReviewModal";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ReviewService from "../../api/ReviewService";
import UserReview from "../../components/User/UserReview";

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
