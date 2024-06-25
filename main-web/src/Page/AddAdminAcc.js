import React, { useState, useEffect } from "react";
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

function AddAdminAccContent() {
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
    const [role, setUserRole] = useState("Admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    // const [site, setSite] = useState('-');
    const [email_verify, setEmailVerfiy] = useState('false');
    const [tel, setUserTel] = useState('-');
    const [employee, setUserEmployee] = useState('-');
    const [type, setUserType] = useState('-');
    const navigate = useNavigate();  

    function handleSubmit(event) {
      event.preventDefault();    
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
            .post("http://localhost:3333/add_admin_acc", { email, password, name, role, email_verify, tel, employee, type})
            .then((res) => {
              if (res.data.added) {
                alert("Add Admin Account : " + name + " Success!");
                navigate("/users");
              } 
              else {
              alert("Add Account Failed. Please Try Again!");
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
    console.log(userEmail)

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
        <Navbar.Brand href="/users">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
            <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
        </svg>
        &nbsp; Staff List
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
              <h2>Add Admin Account</h2>
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
                placeholder="Enter Password (max 16 character)"
                required
                onChange={(e) => setPassword(e.target.value)}
                maxLength={16}
               />
              </div>
              
              <div className="mb-4">
                <label>Name</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter Name (max 20 character)"
                required
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
               />
              </div>

              <div className="mb-4">
                <label htmlFor="Select UserRole">Role</label>
                <select
                className="form-control"
                onChange={(e) => setUserRole(e.target.value)}
                disabled
                >
                  <option>Admin</option>
                </select>
              </div>
              {/* {role =='Customer' && siteName =='' &&(
                alert("Not Found Site,Please Add New Site Before Add User Type : Customer!!!"),
                navigate("/home")
              )} */}
              {/* {role !== 'Admin' && role !== '' &&(
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
              )} */}

              <div
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              >
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Add Account!
                </button>
              </div>                           
            </form>
          </div>
        </div>          
      );
    }
    
export default function AddAdminAcc() {
    return <AddAdminAccContent />
}