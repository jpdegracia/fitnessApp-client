import { Container, Row, Col } from 'react-bootstrap';
import WorkoutCard from './WorkoutCard';

export default function UserView({ workoutsData }) {
    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                {workoutsData.map((workout) => (
                    <Col key={workout._id} className="d-flex justify-content-center">
                        <WorkoutCard data={workout} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
