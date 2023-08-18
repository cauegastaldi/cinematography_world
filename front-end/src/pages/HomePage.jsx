import "../styles/HomePage.css";
import { useState } from "react";
import { Card, Col, Fade, Row } from "react-bootstrap";

const HomePage = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Row className="my-2">
				<Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
					<Card
						onMouseOver={() => setOpen(true)}
						onMouseOut={() => setOpen(false)}
						className="mediaCard"
					>
						<Fade
							in={open}
							timeout={0.3}
						>
							<div id="example-fade-text">
								Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
								terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
								labore wes anderson cred nesciunt sapiente ea proident.
							</div>
						</Fade>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default HomePage;
