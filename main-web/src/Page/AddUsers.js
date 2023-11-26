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
    const [site, setSite] = useState("Select User Site");
    const navigate = useNavigate();  

    function handleSubmit(event) {
      event.preventDefault();
      if (role !== "Select User Role" && email !== '' && password !== '' && name !== ''&& site !== 'Select User Site') {
        axios
          .post("http://localhost:3333/register", { email, password, name, role, site })
          .then((res) => {
            if (res.data.added) {
              alert("Add User Success!");
              navigate("/users");
            } else {
              alert("Add User Failed. Please Try Again!");
            }
          })
          .catch((err) => console.log(err));
      }else{
          alert("Please Complete The Information!");
      }
    }

    const [siteName,setSiteName] = useState([])
    async function getDataSite() {
      const getSiteName = await axios.get("http://localhost:3333/site_name")
      setSiteName(getSiteName.data)
    }
    useEffect(() => {
      getDataSite();
    }, []);

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/dbadmin'>
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
                placeholder="Enter Email"
                required
                onChange={(e) => setEmail(e.target.value)}
               />
              </div>
              
              <div className="mb-4">
                <label>Password</label>
                <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                required
                onChange={(e) => setPassword(e.target.value)}
               />
              </div>
              
              <div className="mb-4">
                <label>Name</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
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
                <select
                className="form-control"
                onChange={(e) => setSite(e.target.value)}
                >
                  <option>Select User Site</option>
                  <option value="None">None (For Admin)</option>
                  {siteName.map((siteName, index) => (
                    <option key={index}>{siteName.name}</option>             
                  ))}
                </select>
              </div>
              <div
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              >
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Add User!
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