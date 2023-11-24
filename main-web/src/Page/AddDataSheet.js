import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

function AddDataSheetContent() {
  //Check Token API
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } 
        else{
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
          window.location = "/login";
        }
      })
      .catch((error) => {
      console.log("Error:", error);
      });
  }, []);

  const location = useLocation();
  const [paramPath, setParamPath] = useState(location.state.device);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (name != "" && url != "") {
      axios
        .post("http://localhost:3333/adddatasheet", { type, name, url })
        .then((res) => {
          if (res.data.added) {
            alert("Add Datasheet : " + (name) + " Device : " + (type) + " Complete!");
            navigate("/dbadmin");
          } else {
            alert("Error! Please Try Again.");
          }
        })
        .catch((err) => console.log(err));
    }else{
        alert("Please Complete The Information!");
    }
  }

  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href='/dbadmin'>Back To Dashboard</Navbar.Brand>
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
            <h2>Add New Datasheet For Device</h2>
          </div>

          {paramPath == "AP" && (
          <div className="mb-4">
            <label htmlFor="Select DeviceType">Device Type</label>
            <select
              className="form-control"
              onChange={(e) => setType(e.target.value)}
            >
              <option>Select Device Type</option>
              <option value="AP">Access Point</option>
            </select>
          </div> 
          )}
          {paramPath == "SW" && (
          <div className="mb-4">
            <label htmlFor="Select DeviceType">Device Type</label>
            <select
              className="form-control"
              onChange={(e) => setType(e.target.value)}
            >
              <option>Select Device Type</option>
              <option value="SW">Switch</option>
            </select>
          </div> 
          )}                       

          <div className="mb-4">
            <label>Datasheet Name</label>
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
              className="form-control"
              placeholder="Example : https://www.google.com/"
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
              Add Datasheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddDataSheet() {
  return <AddDataSheetContent />;
}
