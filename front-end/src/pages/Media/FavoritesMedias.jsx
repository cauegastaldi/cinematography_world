import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import styles from "../../styles/HomePage/HomePage.module.css";
import { Col, Form, Row } from "react-bootstrap";
import MediaCard from "../../components/Media/MediaCard";
import MediaService from "../../api/MediaService";

const FavoritesMedias = () => {
	const { user } = useAuth();
	const [originalMedias, setOriginalMedias] = useState([]);
	const [favoritesMedias, setFavoritesMedias] = useState([]);

	const loadData = async () => {
		const favoritedMedias = await MediaService.findAllFavoritedMedias();

		const favoritedMediasByUser = favoritedMedias.filter((favoritedMedia) => {
			return favoritedMedia.usersWhoLiked.some((userWhoLiked) => {
				return userWhoLiked.id === user.userId;
			});
		});

		setOriginalMedias(favoritedMediasByUser);
		setFavoritesMedias(favoritedMediasByUser);
	};

	const searchMedia = async (mediaName) => {
		if (mediaName === "") {
			setFavoritesMedias(originalMedias);
		} else {
			const regex = new RegExp(`^${mediaName}`);

			const foundMedias = originalMedias.filter((media) => {
				return regex.test(media.name.toLowerCase());
			});

			setFavoritesMedias(foundMedias);
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
				{favoritesMedias.map((media) => {
					return (
						<Col
							sm={4}
							md={3}
							lg={2}
						>
							<MediaCard
								key={media.id}
								media={media}
								loadData={() => loadData()}
								isFavoriteCard={true}
							/>
						</Col>
					);
				})}
			</Row>
		</>
	);
};

export default FavoritesMedias;
