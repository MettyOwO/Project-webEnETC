import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function EmailVerify1() { 
  const show = useState(true);
  const [email_name, setEmailName] = useState("");
  const navigate = useNavigate();  

    function handleSubmit(event) {
      event.preventDefault();
      axios.post("http://localhost:3333/sendmail", { email_name })
      .then((res) => {
        if (res.data.error) {
          alert("Failed Send Verify Link to " + email_name);
        } else {
            alert("Send Verify Link to " + email_name + " Complete!");
            navigate("/login");
        }
      })
      .catch((err) => console.log(err));  
    }

    function handleClose(event) {
        event.preventDefault();
        navigate("/login");
    }

  return (
    <>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Send Email Verify</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please enter your email"
                autoFocus
                onChange={(e)=>{setEmailName(e.target.value)}}
              />
            </Form.Group>         
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Send!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmailVerify1;