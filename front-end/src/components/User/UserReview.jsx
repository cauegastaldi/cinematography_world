import { useEffect, useState } from "react";
import { Card, Image } from "react-bootstrap";
import styles from "../../styles/Review/UserReview.module.css";
import UserService from "../../api/UserService";
import ReactStars from "react-rating-stars-component";
import ReviewModal from "../Review/ReviewModal";
import ReviewService from "../../api/ReviewService";
import { useAuth } from "../../hooks/useAuth";
import ReviewCommentModal from "../Review/ReviewCommentModal";
import ReviewComment from "./ReviewComment";

const UserReview = ({ review, media, loadData }) => {
	const auth = useAuth();
	const loggedUser = auth.user;
	const [reviewUser, setReviewUser] = useState(null);
	const [modalShow, setModalShow] = useState(false);
	const [userLikedReview, setUserLikedReview] = useState(false);
	const [openComments, setCommentsOpen] = useState(false);
	const [reviewComments, setReviewComments] = useState([]);
	const [commentModalShow, setCommentModalShow] = useState(false);

	const findUser = async () => {
		const reviewUser = await UserService.findUserById(review.userId);
		setReviewUser({
			id: reviewUser.id,
			username: reviewUser.username,
			imagePath: `http://localhost:8000${reviewUser.imagePath}`,
		});
	};

	const findReviewComments = async () => {
		await ReviewService.findReviewComments(review.id, setReviewComments);
	};

	const hasUserLikedReview = async () => {
		const response = await ReviewService.findUsersWhoLikedReview(review.id);
		const loggedUserId = loggedUser.userId;
		let findUser = null;
		if (!response.errors) {
			findUser = response.find((userId) => {
				return userId === loggedUserId;
			});
			setUserLikedReview(findUser != null);
		}
	};

	const handleReviewDeletion = async (id) => {
		await ReviewService.removeReview(id);
		window.location.reload();
	};

	const handleReviewLike = async (id) => {
		await ReviewService.likeReview(id);
		loadData();
		hasUserLikedReview();
	};

	const handleReviewUnlike = async (id) => {
		await ReviewService.unlikeReview(id);
		loadData();
		hasUserLikedReview();
	};

	const loadComments = async () => {
		findReviewComments();
	};

	const handleReviewCommentDeletion = async (id) => {
		await ReviewService.removeReviewComment(id);
		findReviewComments();
	};

	useEffect(() => {
		findUser();
		hasUserLikedReview();
		loadComments();
	}, []);

	return (
		<>
			<Card className={styles.card}>
				<Card.Body className={styles.body}>
					<div>
						<div className={styles.userDetails}>
							<Image
								rounded
								src={reviewUser?.imagePath}
								className={styles.userImage}
							/>
							<Card.Subtitle className={`mb-2`}>{reviewUser?.username}</Card.Subtitle>
							<Card.Subtitle className={`mx-2 mb-2`}>
								<ReactStars
									edit={false}
									count={5}
									isHalf
									value={review.mediaScore}
									size={20}
								/>
							</Card.Subtitle>
							<Card.Subtitle className={`mb-2 fw-normal`}>
								{review.likes === 1 && <small>{review.likes} curtida</small>}
								{review.likes !== 1 && <small>{review.likes} curtidas</small>}
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
								<i className="bi bi-pencil-square"></i> Editar
							</Card.Link>
						</>
					)}
					{(loggedUser?.userId === review.userId || loggedUser?.userType === "ADMIN") && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={() => handleReviewDeletion(review.id)}
						>
							<i className="bi bi-trash3" /> Excluir
						</Card.Link>
					)}

					{loggedUser != null && userLikedReview === true && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={() => handleReviewUnlike(review.id)}
						>
							<i className="bi bi-heart-fill"></i> Curtir
						</Card.Link>
					)}
					{loggedUser != null && userLikedReview === false && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={() => handleReviewLike(review.id)}
						>
							<i className="bi bi-heart"></i> Curtir
						</Card.Link>
					)}
					{!openComments && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={() => {
								setCommentsOpen(true);
							}}
						>
							<i className="bi bi-chat"></i> Comentários{" "}
							<span className={styles.commentsNumber}>
								({reviewComments?.length})
							</span>
						</Card.Link>
					)}
					{openComments && (
						<>
							<Card.Link
								className={`${styles.link} mx-2`}
								onClick={() => {
									setCommentsOpen(false);
								}}
							>
								<i className="bi bi-chat"></i> Comentários{" "}
								<span className={styles.commentsNumber}>
									({reviewComments?.length})
								</span>
							</Card.Link>
						</>
					)}
					{loggedUser != null && (
						<Card.Link
							className={`${styles.link} mx-2`}
							onClick={() => {
								setCommentModalShow(true);
							}}
						>
							<i className="bi bi-chat-dots"></i> Comentar
						</Card.Link>
					)}
				</Card.Footer>
			</Card>

			<div className={styles.commentsContainer}>
				{openComments === true &&
					reviewComments.map((reviewComment) => {
						return (
							<ReviewComment
								reviewComment={reviewComment}
								loggedUser={loggedUser}
								review={review}
								reviewUser={reviewUser}
								handleReviewCommentDeletion={() =>
									handleReviewCommentDeletion(reviewComment.id)
								}
								loadData={() => findReviewComments()}
							/>
						);
					})}
			</div>

			<ReviewModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				media={media}
				review={review}
				loadData={loadData}
			/>
			<ReviewCommentModal
				show={commentModalShow}
				onHide={() => {
					setCommentModalShow(false);
				}}
				review={review}
				reviewUser={reviewUser?.username}
				loadData={() => window.location.reload()}
			/>
		</>
	);
};

export default UserReview;
