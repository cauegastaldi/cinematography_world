import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import styles from "../../styles/Review/UserReview.module.css";
import UserService from "../../api/UserService";
import ReactStars from "react-rating-stars-component";
import ReviewModal from "../Review/ReviewModal";
import ReviewService from "../../api/ReviewService";
import { useAuth } from "../../hooks/useAuth";

const UserReview = ({ review, media, loadData }) => {
	const auth = useAuth();
	const loggedUser = auth.user;
	const [reviewUser, setReviewUser] = useState(null);
	const [modalShow, setModalShow] = useState(false);

	const findUser = async () => {
		const reviewUser = await UserService.findUserById(review.userId);

		setReviewUser({ id: reviewUser.id, username: reviewUser.username });
	};

	const handleReviewDeletion = async (id) => {
		await ReviewService.removeReview(id);
		loadData();
	};

	useEffect(() => {
		findUser();
	}, []);

	return (
		<>
			<Card className={styles.card}>
				<Card.Body className={styles.body}>
					<div>
						<div className={styles.userDetails}>
							<Card.Subtitle className={`mb-2`}>
								{reviewUser?.username}{" "}
							</Card.Subtitle>
							<Card.Subtitle className={`mx-2 mb-2`}>
								<ReactStars
									edit={false}
									count={5}
									isHalf
									value={review.mediaScore}
									size={20}
								/>
							</Card.Subtitle>
						</div>

						<Card.Text className="mt-3">{review.comment}</Card.Text>
					</div>
				</Card.Body>
				<Card.Footer className={styles.footer}>
					<small>{review.publishDate}</small>
					{loggedUser?.userId === review.userId && (
						<>
							<Card.Link
								className={`${styles.link} mx-2`}
								onClick={() => setModalShow(true)}
							>
								<i class="bi bi-pencil-square"></i> Editar
							</Card.Link>
						</>
					)}
					{(loggedUser?.userId === review.userId || loggedUser?.userType === "ADMIN") && (
						<Card.Link
							className={`${styles.link} mx-1`}
							onClick={() => handleReviewDeletion(review.id)}
						>
							<i class="bi bi-trash3" /> Excluir
						</Card.Link>
					)}
				</Card.Footer>
			</Card>

			<ReviewModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				media={media}
				review={review}
				loadData={loadData}
			/>
		</>
	);
};

export default UserReview;
