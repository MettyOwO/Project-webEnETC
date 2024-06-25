import React, { useState, useEffect } from "react";
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

function AddUsersContent() {
    //Register API
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [tel, setUserTel] = useState('');
    const [employee, setUserEmployee] = useState('');
    const [role, setUserRole] = useState('User');
    const [email_verify, setEmailVerfiy] = useState('false');
    const [type, setUserType] = useState('-');
    // const [site, setSite] = useState('-');
    const navigate = useNavigate();  

    function handleSubmit(event) {
      event.preventDefault();    
        if (email !== '' && password !== '' && name !== ''&& role !== '' && tel !== '' && employee !== '') {
          const lowercaseInputValue = email.toLowerCase();
          const lowercaseArray = userEmail.map(element => element.toLowerCase());
          // Check if the lowercaseInputValue exists in the lowercaseArray
          if (lowercaseArray.includes(lowercaseInputValue)) {
            // If it already exists, show an alert
            alert(`Email : "${email}" already exists in database. Please try again!`);
          }else {
            axios
            .post("http://localhost:3333/register", { email, password, name, role, tel, employee, email_verify, type})
            .then((res) => {
              if (res.data.added) {
                alert("Create Account : " + name + " Complete! Go check verify link in your email.");
                navigate("/login");
              } else {
                alert("Create Account Failed. Please Try Again!");
              }
            })
          .catch((err) => console.log(err));     
        }                   
      }     
    else{
      alert("Please Complete The Information!");
    }
  }
  
    // const [siteName,setSiteName] = useState([])
    const [userEmail,setUserEmail] = useState([])
    async function getData() {
      // const getSiteName = await axios.get("http://localhost:3333/site_name")
      const getEmail = await axios.get("http://localhost:3333/users")
      const dataEmail = []
      getEmail.data.map((item)=>{    
          dataEmail.push(item.email)
      })
      // setSiteName(getSiteName.data)
      setUserEmail(dataEmail)
    }
    useEffect(() => {
      getData();
    }, []);
    // console.log(userEmail)

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href=''>
            Network Maintenance Information System
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
              <h3>Sign Up</h3>
            </div>

            <div className="mb-3">
                <label>Email address</label>
                <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                required
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        
            <div className="mb-3">
                <label>Password</label>
                <input
                type="password"
                className="form-control"
                placeholder="Enter your password (max 16 character)"
                required
                onChange={(e) => setPassword(e.target.value)}
                maxLength={16}
                />
            </div>

            <div className="mb-3">
                <label>Name</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter your name (max 20 character)"
                required
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                />
            </div>

            <div className="mb-3">
                <label>Tel</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter your tel ex : 088xxxxxxx"
                required
                onChange={(e) => setUserTel(e.target.value)}
                maxLength={10}
                />
            </div>

            <div className="mb-3">
                <label>Employee ID</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter your employee id"
                required
                onChange={(e) => setUserEmployee(e.target.value)}
                />
            </div>
        
            <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                Register!
                </button>
            </div>
            
            <br/>
            <div       
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',}}
            >
            <p className="forgot-password text-right">
                Already Registered Account? <a href="/login">Sign In Here!</a>
            </p>
            </div>

            </form>
          </div>
        </div>          
      );
    }
    
export default function AddUsers() {
    return <AddUsersContent />
}