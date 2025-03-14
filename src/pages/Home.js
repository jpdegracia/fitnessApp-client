import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {


	return (
		<Row className='mt-5 py-5'>
			<div className='col-md-8 mx-auto mt-5 pt-5'>
				<h1>Welcome to Zuitt Workouts</h1>
				<p>Your Workout Tracker!</p>
				<Link variant="primary"to={"/login"}>Login to get Started</Link>
			</div>
		</Row>
	)
    
}