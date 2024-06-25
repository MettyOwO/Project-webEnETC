import { useEffect, useState } from 'react';
import {  useNavigate, useParams  } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function ResponsibleSite() { 
  const show = useState();
  const {site} = useParams();
  const [user_site, setUserSite] = useState([]);
  const navigate = useNavigate();
  
  async function getUserSite(){
      const getSiteName = await axios.get("http://localhost:3333/user_site")
      const SiteName = []
      getSiteName.data.map((item)=>{          
          if(site === item.site){
              SiteName.push(item)
          }
        })
        setUserSite(SiteName)
  };
  useEffect(() => {
    getUserSite();
  },[])

  function handleClose(event) {
    event.preventDefault();
    navigate("/home2");
  }

  return (
    <>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Responsible</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Select className="mb-3">
              {user_site.map ((item,index) => (  
              <option key={index}>{item.username}</option>
              ))}
              </Form.Select>      
            </Form.Group>     
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResponsibleSite;