import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

function AddModelContent() {
  //Check Token API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const site1 = localStorage.getItem("site");
    const name1 = localStorage.getItem("name");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, email, site1, name1
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } else {
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("site");
          localStorage.removeItem("name");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  const location = useLocation();
  const [paramPath] = useState(location.state.device);
  const [type, setType] = useState(paramPath);
  const [name, setName] = useState("");
  const [role, SetDeviceRole] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const [model_name,setModelName] = useState([])
  const [model_name2,setModelName2] = useState([])
  async function getData() {
    const getModelData = await axios.get("http://localhost:3333/ap_model")
    const getModelData2 = await axios.get("http://localhost:3333/sw_model")
    const datamodel = []
    const datamodel2 = []
    getModelData.data.map((item)=>{    
      datamodel.push(item.name)
    })
    getModelData2.data.map((item)=>{    
      datamodel2.push(item.name)
    })
    setModelName(datamodel)
    setModelName2(datamodel2)
  }
  useEffect(() => {
    getData();
  }, []);


  function handleSubmit(event) {
    event.preventDefault();
    if (name !== "" && url !== "" && role !== "" && paramPath === "AP") {
      const lowercaseInputValue = name.toLowerCase();
      const lowercaseArray = model_name.map(element => element.toLowerCase());
      // Check if the lowercaseInputValue exists in the lowercaseArray
      if (lowercaseArray.includes(lowercaseInputValue)) {
        // If it already exists, show an alert
        alert(`Model Name : "${name}" already exists in database. Please try again!`);
      } else {
      axios
        .post("http://localhost:3333/addmodel", { type, name, role, url})
        .then((res) => {
          if (res.data.added) {
            alert("Add Model : " + (name) + " Device : " + (type) + " Role : " + (role) + " Complete!");
            navigate("/dbusers");
          } else {
            alert("Error! Please Try Again.");
          }
        })
        .catch((err) => console.log(err));
    }}else if (name !== "" && url !== "" && role !== "" && paramPath === "SW"){
      const lowercaseInputValue = name.toLowerCase();
      const lowercaseArray = model_name2.map(element => element.toLowerCase());
      // Check if the lowercaseInputValue exists in the lowercaseArray
      if (lowercaseArray.includes(lowercaseInputValue)) {
        // If it already exists, show an alert
        alert(`Model Name : "${name}" already exists in database. Please try again!`);
      } else{
      axios
      .post("http://localhost:3333/addmodel", { type, name, role, url})
      .then((res) => {
        if (res.data.added) {
          alert("Add Model : " + (name) + " Device : " + (type) + " Role : " + (role) + " Complete!");
          navigate("/dbusers");
        } else {
          alert("Error! Please Try Again.");
        }
      })
      .catch((err) => console.log(err));
    }}else{
        alert("Please Complete The Information!");
    }
  }

  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href='/dbusers'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-back" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
          </svg>
          &nbsp; Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto"></Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <form className="container mt-3 mb-3" onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Add New Model For Device</h2>
          </div>

          {paramPath === "AP" && (
            <div className="mb-4">
              <label>Device Type</label>
              <input
                type="text"
                className="form-control"
                value="Access Point"
                disabled
                onChange={(e) => setType(e.target.value)}
              />
            </div> 
          )}
          {paramPath === "SW" && (
          <div className="mb-4">
            <label>Device Type</label>
            <input
              type="text"
              className="form-control"
              value="Switch"
              disabled
              onChange={(e) => setType(e.target.value)}
            />
          </div> 
          )}                                        

{paramPath === "AP" && (

<div className='mb-4'>
  <label>Model Role</label>
  <select className="form-control" 
    onChange={e => SetDeviceRole(e.target.value)}>
    <option defaultValue>Select Role</option>
    <option>Indoor</option>
    <option>Outdoor</option>
  </select>
</div>
)}
{paramPath === "SW" && (

<div className='mb-4'>
  <label>Model Role</label>
  <select className="form-control" 
    onChange={e => SetDeviceRole(e.target.value)}>
    <option defaultValue>Select Role</option>
    <option>Access</option>
    <option>Distribute</option>
</select>
</div>
)}                                        

          <div className="mb-4">
            <label>Model Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        
          <div className="mb-4">
            <label>URL</label>
            <input
              type="text"
              placeholder="Example : https://www.google.com/"
              className="form-control"
              required
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button className="btn btn-primary" onClick={handleSubmit}>
              Add Datasheet!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddModel() {
  return <AddModelContent />;
}
