import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col, Spinner, Alert, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function WorkoutCard() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDuration, setUpdatedDuration] = useState("");
  const navigate = useNavigate(); // ✅ Corrected useNavigate()

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch workouts");
        }

        setWorkouts(Array.isArray(data.workouts) ? data.workouts : []);
      } catch (err) {
        setError(err.message);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this workout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete workout");
        }

        setWorkouts(workouts.filter((workout) => workout._id !== id));
        Swal.fire("Deleted!", "Your workout has been deleted.", "success");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setWorkouts(
        workouts.map((workout) =>
          workout._id === id ? { ...workout, status: "completed" } : workout
        )
      );
      Swal.fire("Success!", "Workout marked as complete!", "success");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${currentWorkout._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName, duration: updatedDuration }),
      });

      if (!response.ok) {
        throw new Error("Failed to update workout");
      }

      setWorkouts(
        workouts.map((workout) =>
          workout._id === currentWorkout._id
            ? { ...workout, name: updatedName, duration: updatedDuration }
            : workout
        )
      );
      Swal.fire("Updated!", "Workout updated successfully!", "success");
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      {loading && <Spinner animation="border" className="d-block mx-auto m-5" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Centered Add Workout Button */}
      <div className="d-flex justify-content-center my-3">
        <Button variant="primary" onClick={() => navigate("/addWorkouts")}>
          Add Workouts
        </Button>
      </div>

      <Row>
        {workouts.map((workout) => (
          <Col md={6} lg={4} key={workout._id} className="mb-4">
            <Card className="h-100" style={{ minHeight: "200px" }}>
              <Card.Body>
                <Card.Title>{workout.name}</Card.Title>
                <Card.Text>
                  <strong>Duration:</strong> {workout.duration} <br />
                  <strong>Status:</strong> {workout.status}
                </Card.Text>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentWorkout(workout);
                    setUpdatedName(workout.name);
                    setUpdatedDuration(workout.duration);
                    setShowModal(true);
                  }}
                >
                  Update
                </Button>
                <Button variant="primary" className="me-2" onClick={() => handleComplete(workout._id)}>
                  Mark as Complete
                </Button>
                <Button variant="danger" onClick={() => handleDelete(workout._id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration (mins)</Form.Label>
              <Form.Control type="text" value={updatedDuration} onChange={(e) => setUpdatedDuration(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
