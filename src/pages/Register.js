import { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if ((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !== "" && confirmPassword !== "")
            && (password === confirmPassword) && (mobileNo.length === 11)) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`https://fitnessapp-api-ln8u.onrender.com/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                mobileNo,
                password
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.message === "Registered Successfully") {
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setMobileNo('');
                    setPassword('');
                    setConfirmPassword('');
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Registration successful',
                    });
                } else if (data.message === "Email invalid") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Email is invalid',
                    });
                } else if (data.message === "Mobile number is invalid") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Mobile number is invalid',
                    });
                } else if (data.message === "Password must be atleast 8 characters long") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Password must be at least 8 characters',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Something went wrong.',
                    });
                }
            });
    }

    return (
        (user.id !== null) ?
            <Navigate to="/login" />
            :
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="p-4" style={{ width: '400px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                    <h1 className="text-center">Register</h1>
                    <Form onSubmit={registerUser}>

                        <Form.Group>
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your First Name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your Last Name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Mobile Number:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your 11 digit mobile number"
                                required
                                value={mobileNo}
                                onChange={(e) => setMobileNo(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Verify Password:</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Verify your password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>

                        {!isActive && (
                            <Alert variant="danger" className="mt-3 text-center">
                                Please enter your registration details
                            </Alert>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mt-3"
                            disabled={!isActive}
                        >
                            Register
                        </Button>
                    </Form>

                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Click here</Link> to log in.
                    </p>
                </Card>
            </div>
    );
}
