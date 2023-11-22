import React, { useState, useEffect } from "react";
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

function AddUsersContent() {
    //Check Token API
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
            
        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem('token')
            window.location = '/Login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
    },[])    
    
    //Register API
    const [role, setUserRole] = useState("Select User Role");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [site, setSite] = useState("");
    const navigate = useNavigate();  

    function handleSubmit(event) {
      event.preventDefault();
      if (role !== "Select User Role" && email !== '' && password !== '' && name !== ''&& site !== '') {
        axios
          .post("http://localhost:3333/register", { email, password, name, role, site })
          .then((res) => {
            if (res.data.added) {
              alert("Register User Sucess!");
              navigate("/users");
            } else {
              alert("Register User Failed!");
            }
          })
          .catch((err) => console.log(err));
      }else{
          alert("Please Complete The Information!");
      }
    }

    //Log Out Function
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/Login'
    }    
    
    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/dbadmin'>Back To Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto"></Nav>
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>

        <div>
          <form className="container mt-3 mb-3" onSubmit={handleSubmit}>
            <div       
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',}}
            >
              <h2>Add User Data</h2>
            </div>
              <div className="mb-4">
                <label>Email</label>
                <input
                type="text"
                className="form-control"
                required
                onChange={(e) => setEmail(e.target.value)}
               />
              </div>
              
              <div className="mb-4">
                <label>Password</label>
                <input
                type="text"
                className="form-control"
                required
                onChange={(e) => setPassword(e.target.value)}
               />
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
                <label htmlFor="Select UserRole">Role</label>
                <select
                className="form-control"
                onChange={(e) => setUserRole(e.target.value)}
                >
                  <option>Select User Role</option>
                  <option>Customer</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="mb-4">
                <label>Site</label>
                <input
                type="text"
                className="form-control"
                required
                onChange={(e) => setSite(e.target.value)}
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
                  Add User
                </button>
              </div>                           
            </form>
          </div>
        </div>          
      );
    }
    
export default function AddUsers() {
    return <AddUsersContent />
}