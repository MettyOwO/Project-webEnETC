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
      const token = localStorage.getItem("token");
      const name1 = localStorage.getItem("name");
      fetch("http://localhost:3333/authen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, name1,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
          } else {
            alert("Authen Failed. Please Try Login Again!");
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            window.location = "/login";
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
  }, []);
    
    //Register API
    const [role, setUserRole] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [site, setSite] = useState('-');
    const navigate = useNavigate();  

    function handleSubmit(event) {
      event.preventDefault();    
      if (role == 'Admin'){
        if (email !== '' && password !== '' && name !== ''&& role !== '') {
          const lowercaseInputValue = email.toLowerCase();
          const lowercaseArray = userEmail.map(element => element.toLowerCase());
          // Check if the lowercaseInputValue exists in the lowercaseArray
          if (lowercaseArray.includes(lowercaseInputValue)) {
            // If it already exists, show an alert
            alert(`Email : "${email}" already exists in database. Please try again!`);
          }
          else {
            axios
            .post("http://localhost:3333/register", { email, password, name, role, site})
            .then((res) => {
              if (res.data.added) {
                alert("Add User : " + name + " Role : " + role + " Success!");
                navigate("/users");
              } 
              else {
              alert("Add User Failed. Please Try Again!");
              }
            })
          .catch((err) => console.log(err));      
          }
        }       
      }
      else if (role == 'Customer'){
        if (email !== '' && password !== '' && name !== ''&& role !== '' && site !== '-') {
          const lowercaseInputValue = email.toLowerCase();
          const lowercaseArray = userEmail.map(element => element.toLowerCase());
          // Check if the lowercaseInputValue exists in the lowercaseArray
          if (lowercaseArray.includes(lowercaseInputValue)) {
            // If it already exists, show an alert
            alert(`Email : "${email}" already exists in database. Please try again!`);
          }else {
            axios
            .post("http://localhost:3333/register", { email, password, name, role, site})
            .then((res) => {
              if (res.data.added) {
                alert("Add User : " + name + " Role : " + role + " Success!");
                navigate("/users");
              } else {
                alert("Add User Failed. Please Try Again!");
              }
            })
          .catch((err) => console.log(err));     
        }                   
      }     
    }
    else{
      alert("Please Complete The Information!");
    }
  }
  
    const [siteName,setSiteName] = useState([])
    const [userEmail,setUserEmail] = useState([])
    async function getData() {
      const getSiteName = await axios.get("http://localhost:3333/site_name")
      const getEmail = await axios.get("http://localhost:3333/users")
      const dataEmail = []
      getEmail.data.map((item)=>{    
          dataEmail.push(item.email)
      })
      setSiteName(getSiteName.data)
      setUserEmail(dataEmail)
    }
    useEffect(() => {
      getData();
    }, []);
    console.log(userEmail)

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/home'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
            </svg>
            &nbsp; Home
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
                  <option>Select Role</option>
                  <option>Customer</option>
                  <option>Admin</option>
                </select>
              </div>
              {role =='Customer' && siteName =='' &&(
                alert("Not Found Site,Please Add New Site Before Add User Type : Customer!!!"),
                navigate("/home")
              )}
              {role !== 'Admin' && role !== '' &&(
              <div className="mb-4">
                <label>Site</label>
                <select
                className="form-control"
                onChange={(e) => setSite(e.target.value)}
                >
                  <option>Select Site</option>
                  {siteName.map((siteName, index) => (
                    <option key={index}>{siteName.name}</option>             
                  ))}
                </select>
              </div>
              )}

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