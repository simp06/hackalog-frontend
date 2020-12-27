import React, { useState } from "react";
import {
    Form, Spinner, Col,
    Modal, Button, Container
} from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import axios from "../../util/axios";
import { options } from "./SkillOptions";

export const EditProfile = ({
    handle, bio, interest, name, url,
    username, handleClose, show, closable,
}) => {
    const [err, seterr] = useState('');
    const [wait, setwait] = useState(false);
    const handleChange = (newValue) => setSelectedSkills(newValue);
    const [selectedSkills, setSelectedSkills] = useState(
        interest.length
            ? interest.split(',').map((s) => {
                return { label: s.trim(), value: s.trim() };
            })
            : []
    );
    const handleSubmit = () => {
        const name = document.getElementById('name').value.trim();
        const handle = document.getElementById('handle').value.trim().toLowerCase();
        const bio = document.getElementById('bio').value.trim();
        const interests = selectedSkills
            ? String(selectedSkills.map((s) => s.label))
            : '';
        const username = document.getElementById('username').value.trim().toLowerCase();
        var check = [name, handle, username, interests, bio].every((elm) => {
            return elm !== '';
        });
        if (check) {
            setwait(true);
            const data = {
                name: name ?? '',
                college: 'IIT (BHU) VARANASI',
                bio: bio ?? '',
                interests: interests ?? '',
                username: username,
                github_handle: handle,
                photoURL: url
            };
            console.log(url)
            axios
                .patch(`profile/`, data)
                .then(setwait(false))
                .then(
                    () => {
                        handleClose();
                        location.reload();
                    },
                    (err) => {
                        console.log(err.response.data)
                        err.response.data.username
                            ? seterr(String(err.response.data.username))
                            : seterr(
                                'Some Error Occurred Communicating with the Server'
                            );
                    }
                );
        } else seterr('All Required Fields must be Filled');
    };
    return (
        <Container className="text-center align-middle">
            <Modal
                show={show}
                onHide={handleClose}
                backdrop={closable ? true : 'static'}
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton={closable}>
                    <Modal.Title>Complete Your Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Text className="text-right">
                            *Required Fields
						</Form.Text>
                        <Form.Group controlId="name">
                            <Form.Label>Name* </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                defaultValue={name}
                            />
                        </Form.Group>
                        <Form.Row>
                            <Col>
                                <Form.Group controlId="handle">
                                    <Form.Label>Handle</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="GitHub Handle"
                                        defaultValue={handle}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="username">
                                    <Form.Label>Username*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        defaultValue={username}
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Group controlId="bio">
                            <Form.Label>Bio*</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Bio"
                                defaultValue={bio}
                            />
                        </Form.Group>
                        <Form.Group controlId="interest">
                            <Form.Label>Interests*</Form.Label>
                            <CreatableSelect
                                isMulti
                                value={selectedSkills}
                                onChange={handleChange}
                                options={options}
                            />
                        </Form.Group>
                    </Form>

                    <p className="text-danger ">{err}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
					</Button>
                    {wait && (
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Submitting...</span>
                        </Spinner>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
