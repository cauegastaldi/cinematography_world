import styles from "../../styles/ProgressBar/CommentProgress.module.css";

const CommentProgress = ({ actualProgress, maxValue }) => {
	const percentualProgress = (actualProgress / maxValue) * 100; // porcentagem do progresso em relação ao total de caracteres máximo permitido

	return (
		<>
			{actualProgress <= maxValue && (
				<div
					className={styles.circularProgress}
					style={{
						background: `conic-gradient(white ${percentualProgress * 3.6}deg, gray ${
							percentualProgress * 3.6
						}deg)`,
					}}
				>
					<div
						className={styles.valueContainer}
						style={{ color: "white" }}
					>
						{actualProgress}
					</div>
				</div>
			)}

			{actualProgress > maxValue && (
				<div
					className={styles.valueContainer}
					style={{ color: "red" }}
				>
					{maxValue - actualProgress}
				</div>
			)}
		</>
	);
};

export default CommentProgress;
