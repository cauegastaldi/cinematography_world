import { Col, Form, Row } from "react-bootstrap";
import MediaCard from "../components/Media/MediaCard";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import MediaService from "../api/MediaService";
import styles from "../styles/HomePage/HomePage.module.css";

const HomePage = () => {
	const auth = useAuth();
	const userType = auth.user?.userType;
	const [medias, setMedias] = useState([]);

	const loadData = async () => {
		setMedias(await MediaService.findAllMedias());
	};

	const searchMedia = async (mediaName) => {
		if (mediaName === "") {
			loadData();
		} else {
			const regex = new RegExp(`^${mediaName}`);

			const medias = await MediaService.findAllMedias();
			const foundMedias = medias.filter((media) => {
				return regex.test(media.name.toLowerCase());
			});

			setMedias(foundMedias);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<>
			<Form.Group>
				<Form.Control
					type="text"
					placeholder="Buscar mídia"
					className={`mr-sm-2 ${styles.searchBar}`}
					onChange={(e) => searchMedia(e.target.value.trim())}
				/>
			</Form.Group>

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
								loadData={() => loadData()}
							/>
						</Col>
					);
				})}
			</Row>
		</>
	);
};

export default HomePage;
