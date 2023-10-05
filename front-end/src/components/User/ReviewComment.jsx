import { useEffect, useState } from "react";
import styles from "../../styles/Review/UserReview.module.css";
import { Card } from "react-bootstrap";
import ReviewService from "../../api/ReviewService";
import ReviewCommentModal from "../Review/ReviewCommentModal";

const ReviewComment = ({
	reviewComment,
	loggedUser,
	handleReviewCommentDeletion,
	review,
	reviewUser,
	loadData,
}) => {
	const [userLikedReviewComment, setUserLikedReviewComment] = useState(false);
	const [likes, setLikes] = useState(reviewComment.likes);
	const [show, setShow] = useState(false);

	const hasUserLikedReviewComment = async (id) => {
		const response = await ReviewService.findUsersWhoLikedReviewComment(id);
		const loggedUserId = loggedUser.userId;

		let findUser = null;
		if (!response.errors) {
			findUser = response.find((userId) => {
				return userId === loggedUserId;
			});
		}

		setUserLikedReviewComment(findUser != null);
	};

	const handleReviewCommentLike = async (id) => {
		await ReviewService.likeReviewComment(id);
		setUserLikedReviewComment(true);
		setLikes(likes + 1);
	};

	const handleReviewCommentUnlike = async (id) => {
		await ReviewService.unlikeReviewComment(id);
		setUserLikedReviewComment(false);
		setLikes(likes - 1);
	};

	useEffect(() => {
		hasUserLikedReviewComment(reviewComment.id);
	}, []);

	return (
		<>
			<Card className={styles.card}>
				<Card.Body className={styles.body}>
					<div>
						<div className={styles.userDetails}>
							<Card.Subtitle className={`mb-2`}>
								{reviewComment.user?.username}
							</Card.Subtitle>

							<Card.Subtitle className={`mx-2 mb-2 fw-normal`}>
								{likes === 1 && <small>{likes} curtida</small>}
								{likes !== 1 && <small>{likes} curtidas</small>}
							</Card.Subtitle>
						</div>

						<Card.Text className="mt-3">{reviewComment.comment}</Card.Text>
					</div>
				</Card.Body>
				<Card.Footer className={styles.footer}>
					<small>{reviewComment.publishDate}</small>
					{loggedUser?.userId === reviewComment.userId && (
						<>
							<Card.Link
								className={`${styles.link} mx-2`}
								onClick={() => setShow(true)}
							>
								<i class="bi bi-pencil-square"></i> Editar
							</Card.Link>
						</>
					)}
					{(loggedUser?.userId === reviewComment.userId ||
						loggedUser?.userType === "ADMIN") && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={handleReviewCommentDeletion}
						>
							<i class="bi bi-trash3" /> Excluir
						</Card.Link>
					)}

					{loggedUser != null && !userLikedReviewComment && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={() => handleReviewCommentLike(reviewComment.id)}
						>
							<i class="bi bi-heart"></i> Curtir
						</Card.Link>
					)}

					{loggedUser != null && userLikedReviewComment && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={() => handleReviewCommentUnlike(reviewComment.id)}
						>
							<i class="bi bi-heart-fill"></i> Curtir
						</Card.Link>
					)}
				</Card.Footer>
			</Card>

			<ReviewCommentModal
				show={show}
				onHide={() => {
					setShow(false);
				}}
				review={review}
				reviewComment={reviewComment}
				reviewUser={reviewUser?.username}
				loadData={loadData}
			/>
		</>
	);
};

export default ReviewComment;
