import { useEffect, useState } from 'react';
import {  useNavigate, useParams  } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function UserResponsible() { 
  const show = useState();
  const {username} = useParams();
  const [user_site, setUserSite] = useState([]);
  const navigate = useNavigate();
  
  async function getUserSite(){
      const getSiteName = await axios.get("http://localhost:3333/user_site")
      const SiteName = []
      getSiteName.data.map((item)=>{          
          if(username === item.username){
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
    navigate("/users");
  }

  const [total_num_site, setSiteCount] = useState(0);
  console.log(total_num_site)
  useEffect(() => {
      const fetchCount1 = async () => {
        try {
          const fetchData = await axios.get("http://localhost:3333/total_site/" + username);
          setSiteCount(fetchData.data.num_site);
        } catch (err) {}
      };
      fetchCount1();
    }, []);

  return (
    <>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            
          {total_num_site !== 0 && (
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Site Name</Form.Label>
              <Form.Select className="mb-3">
              {user_site.map ((item,index) => (  
              <option key={index}>{item.site}</option>
              ))}
              </Form.Select>      
            </Form.Group> 
          )}

          {total_num_site === 0 && (
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Site Name</Form.Label>
              <Form.Select className="mb-3" disabled>
              <option>None</option>
              </Form.Select>      
            </Form.Group> 
          )}
          
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

export default UserResponsible;