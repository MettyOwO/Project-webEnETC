import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Example2() { 
  const [show, setShow] = useState(false);
  const [name, setUName] = useState("");
  const [responsible_site, setResponsible] = useState("");
  const [type1, setType] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    const [user_name,setName] = useState([])
    const [siteName,setSiteName] = useState([])
    const [siteName2,setSiteName2] = useState([])

    async function getData() {
      const getDataSite = await axios.get("http://localhost:3333/site2")
      const getDataName = await axios.get("http://localhost:3333/user_name")
      const getDataSite2 = await axios.get("http://localhost:3333/user_site")
      const dataSite = []
      const dataName = []
      const dataSite2 = []
      getDataSite.data.map((item)=>{    
        dataSite.push(item)
      })
      setSiteName(dataSite)
      getDataName.data.map((item)=>{    
        dataName.push(item)
      })
      setName(dataName)
      getDataSite2.data.map((item)=>{    
        dataSite2.push(item.site)
      })
      setSiteName2(dataSite2)
    }
    useEffect(() => {
      getData();
    }, []);

    function handleSubmit(event) {
      event.preventDefault();
      if (name !== "" && responsible_site !== "" && type1 !== "") {
        const lowercaseInputValue = responsible_site.toLowerCase();
        const lowercaseArray = siteName2.map(element => element.toLowerCase());
        console.log(lowercaseArray)
        // Check if the lowercaseInputValue exists in the lowercaseArray
        if (lowercaseArray.includes(lowercaseInputValue)) {
          // If it already exists, show an alert
          alert(`Account : "${name}" already have site : "${responsible_site}" in database. Please try again!`);
        }
        else {
          axios
          .post("http://localhost:3333/add_responsible", { name, responsible_site, type1})
          .then((res) => {
            if (res.data.added) {
              alert("Add Responsible Site : " + (responsible_site) + " Complete!");
              window.location.reload();
            } else {
              alert("Error! Please Try Again.");
            }
          })
          .catch((err) => console.log(err));
        }
      }
      else{
        alert("Please Complete The Information!");
      }
    }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
      </svg> &nbsp; Responsible
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Responsible Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
                <Form.Select className="mb-3" onChange={e => setUName(e.target.value)}>            
                  <option defaultValue="none">---Select Username---</option>
                  {user_name.map ((user_name, index) => (        
                        <option key={index}>{user_name.name}</option>           
                  ))}
                </Form.Select>
                <Form.Label>Site</Form.Label>
                <Form.Select className="mb-3" onChange={e => setResponsible(e.target.value)}>            
                  <option defaultValue="none">---Select Site---</option>
                  {siteName.map ((siteName,index) => (        
                        <option key={index}>{siteName.name}</option>           
                  ))}
                </Form.Select>
                <Form.Label>Type</Form.Label>
                <Form.Select className="mb-3" onChange={e => setType(e.target.value)}>            
                  <option defaultValue>---Select Type---</option>
                  <option>Leader</option>
                  <option>Team Support</option>
                </Form.Select>
            </Form.Group>        
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example2;