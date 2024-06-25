import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Example(test1) { 
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch ('http://localhost:3333/authen', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+token
        },
    })   
    .then(response => response.json())
    .then(data => {
    if(data.status === 'ok'){
        //ไม่ต้องทำอะไร
    }else{
        alert('Authen Failed. Please Try Login Again!')
        localStorage.removeItem('token')
        window.location = '/login'
    }
    })
    .catch((error) => {
    console.log("Error:", error);
    });
    console.log(test1);
    },[])

    async function getDataAP(){
        const id = test1.id;
        console.log(url);
        await axios.put(`http://localhost:3333/updateaplink/${id}`, {
            url : url
        })
        alert("Add URL : " + (url) + " Complete!");
        handleClose();
        window.location.reload(); 
    }

    async function getDataSW(){
        const id = test1.id;
        console.log(url);
        await axios.put(`http://localhost:3333/updateswlink/${id}`, {
            url : url
        })
        alert("Add URL : " + (url) + " Complete!");
        handleClose();
        window.location.reload();
    }

    async function getDataDC(){
        const id = test1.id;
        console.log(url);
        await axios.put(`http://localhost:3333/updatedclink/${id}`, {
            url : url
        })
        alert("Add URL : " + (url) + " Complete!");
        handleClose();
        window.location.reload();
    }

    async function getDataSWConfig(){
      const id = test1.id;
      console.log(url);
      await axios.put(`http://localhost:3333/updateconfiglink/${id}`, {
          url : url
      })
      alert("Add URL : " + (url) + " Complete!");
      handleClose();
      window.location.reload();
    }

    async function getDataDCSWConfig(){
      const id = test1.id;
      console.log(url);
      await axios.put(`http://localhost:3333/updateconfiglink2/${id}`, {
          url : url
      })
      alert("Add URL : " + (url) + " Complete!");
      handleClose();
      window.location.reload();
    }

    function Check(){
        console.log(test1);
        if(test1.status === "AP"){
            getDataAP()
        }else if (test1.status === "SW"){
            getDataSW()
        }else if (test1.status === "DC"){
            getDataDC()
        }else if (test1.status === "SWConfig"){
          getDataSWConfig()
        }else if (test1.status === "DCSWConfig"){
          getDataDCSWConfig()
        }
    }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
      </svg>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New URL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter url"
                autoFocus
                onChange={(e)=>{setUrl(e.target.value)}}
              />
            </Form.Group>            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={Check}>
            Add URL!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;