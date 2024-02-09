import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";

function HomeContent() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  //Check Token API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name1 = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const site1 = localStorage.getItem("site");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, name1, email, site1
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } else {
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
          localStorage.removeItem("site");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);


  //Log Out
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("site");
    window.location = "/login";
  };
  
  const [siteName,setSiteName] = useState([])
  const [responsibleName,setResponsible] = useState([])
  async function getData() {
    const getSiteName = await axios.get("http://localhost:3333/site2")
    const getResponsibileName = await axios.get("http://localhost:3333/users")
    const siteLocation = localStorage.getItem("site");
    const dataSite = []
    const dataSite2 = []
    getSiteName.data.map((item)=>{    
      if(siteLocation === item.name){
        dataSite.push(item)
      }
    })
    getResponsibileName.data.map((item)=>{    
      if(siteLocation === item.site){
        dataSite2.push(item)
      }
    })
    setResponsible(dataSite2)
    setSiteName(dataSite)
  }
  useEffect(() => {
    getData();
  }, []);

  const username1 = localStorage.getItem("name");
  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Network Maintenance Information System</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
            </Nav>
            <Nav>
              <NavDropdown title={"Profile : " + username1} id="basic-nav-dropdown">         
                <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
              </NavDropdown>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="my-3">
        <div className="vh-100 justify-content-center align-items-center">
            <div className="bg-white p-3">
                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <h2>Site Information</h2>
                </div>
                <br/><br/>
                <table className="table table-bordered">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Contact Customer</th>
                        <th scope="col">Responsible</th>
                        <th scope="col">View</th>
                    </tr>
                    </thead>
                    <tbody>
                    {siteName.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                        <td>
                          {responsibleName.map((item, index) => (
                        <td key={index}>
                          {item.name},                        
                        </td>
                        ))} 
                        </td>
                        <td>
                          <Link
                          to={'/dbusers'}
                          className="btn btn-success"
                          >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
                          <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1"/>
                        </svg>
                        </Link>
                        </td>
                    </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
      </Container>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
