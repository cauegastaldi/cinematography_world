import { useLoaderData } from "react-router-dom";
import { Badge, Card, Col, Image, Row } from "react-bootstrap";
import "../../styles/MediaReviewsPage.css";

const MediaReviewsPage = () => {
	const media = useLoaderData();
	const mediaId = media.id;
	console.log(media);

	return (
		<>
			<Row
				xs={2}
				md={3}
				lg={4}
				xl={5}
			>
				<Col>
					<Card
						id="reviewMediaCard"
						className=" border-0 rounded-0"
					>
						<Image
							id="image"
							src={`http://localhost:8000${media.posterPath}`}
						/>
					</Card>
				</Col>
				<Col>
					<div>
						<h1 className="mediaDetail">{media.name}</h1>
						<p className="mediaDetail">{media.releaseYear}</p>
						<p className="mediaDetail">Dirigido por {media.director}</p>
						<p className="mediaDetail">
							Gêneros: <Badge bg="secondary">{media.genre}</Badge>
						</p>
					</div>
				</Col>
			</Row>
		</>
	);
};

export default MediaReviewsPage;
