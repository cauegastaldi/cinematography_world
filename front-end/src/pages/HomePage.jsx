import { Col, Row } from "react-bootstrap";
import MediaCard from "../components/Media/MediaCard";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import MediaService from "../api/MediaService";

const HomePage = () => {
	const auth = useAuth();
	const userType = auth.user?.userType;
	const [medias, setMedias] = useState([]);

	const loadData = () => {
		MediaService.findAllMedias(setMedias);
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<>
			<Row className="gy-3 my-2">
				{medias.map((media) => {
					return (
						<Col
							sm={4}
							md={3}
							lg={2}
						>
							<MediaCard
								key={media.id}
								media={media}
								userType={userType}
							/>
						</Col>
					);
				})}
			</Row>
		</>
	);
};

export default HomePage;
