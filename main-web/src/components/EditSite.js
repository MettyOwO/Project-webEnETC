import { useEffect, useState } from 'react';
import {  Link, useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Example2() { 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  
  //const handleShow = () => setShow(true);

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name1 = localStorage.getItem("name");
    fetch ('http://localhost:3333/authen', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+token, name1
        },
    })   
    .then(response => response.json())
    .then(data => {
    if(data.status === 'ok'){
        //ไม่ต้องทำอะไร
    }else{
        alert('Authen Failed. Please Try Login Again!')
        localStorage.removeItem('token')
        localStorage.removeItem("name");
        window.location = '/login'
    }
    })
    .catch((error) => {
    console.log("Error:", error);
    });
  },[])

    const navigate = useNavigate();
    function handleSubmit(event) {
      event.preventDefault();
      if (site !== "") {
        axios
          .post("http://localhost:3333/addsite", { site, address })
          .then((res) => {
            if (res.data.added) {
              alert("Add Site : " + (site) + " Complete!");
              navigate("/home");
            } else {
              alert("Error! Please Try Again.");
            }
          })
          .catch((err) => console.log(err));
      }else{
          alert("Please Complete The Information!");
      }
    }

    const [site, setSite] = useState("");
    const [address, setAddress] = useState("");

    function handleShow () {
      setShow(true);
    }

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
      </svg> &nbsp; Site
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please Enter site name"
                autoFocus
                onChange={(e)=>{setSite(e.target.value)}}
                value={site}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Detail</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please Enter detail of site"
                autoFocus
                onChange={(e)=>{setAddress(e.target.value)}}
                value={address}
              />
            </Form.Group>               
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example2;