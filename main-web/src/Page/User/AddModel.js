import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

function UserAddModelContent() {
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

  const [type, setType] = useState("Select Device Type");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (type != "Select Device Type" && name != "" && url != "") {
      axios
        .post("http://localhost:3333/addmodel", { type, name, url })
        .then((res) => {
          if (res.data.added) {
            alert("Add Model : " + (name) + " Device : " + (type) + " Complete!");
            navigate("/dbusers");
          } else {
            alert("Error! Please Try Again.");
          }
        })
        .catch((err) => console.log(err));
    }else{
        alert("Please Complete The Information!");
    }
  }

  //Log Out
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location = "/login";
  };

  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href='/dbusers'>Back To Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link onClick={handleLogout}>Log-Out</Nav.Link>
            </Nav>
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

          <div className="mb-4">
            <label htmlFor="Select DeviceType">Device Type</label>
            <select
              className="form-control"
              onChange={(e) => setType(e.target.value)}
            >
              <option>Select Device Type</option>
              <option value="AP">Access Point</option>
              <option value="SW">Switch</option>
            </select>
          </div>       

          <div className="mb-4">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        
          <div className="mb-4">
            <label>Url</label>
            <input
              type="text"
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
              Add Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddModel() {
  return <UserAddModelContent />;
}
