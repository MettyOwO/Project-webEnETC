import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import AddSite from "../components/AddSite";
import NavDropdown from "react-bootstrap/NavDropdown";

function HomeContent() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
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


  //Log Out
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location = "/login";
  };

  const [siteName,setSiteName] = useState([])
  const [siteName2,setSiteName2] = useState([])
  async function getData() {
    const getSiteName = await axios.get("http://localhost:3333/site_name")
    const getDataSite = await axios.get("http://localhost:3333/site2")
    setSiteName(getDataSite.data)
    setSiteName2(getSiteName.data)
  }
  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (name) => {
    try {
      alert("Delete Site : " + name + " Complete!");
      axios.delete("http://localhost:3333/deletesite/" + name);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

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
              {/* <Nav.Link onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"/>
                <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
              </svg>
              &nbsp; LOG OUT
              </Nav.Link> */}
              <NavDropdown title={"Profile : " + username1} id="basic-nav-dropdown">         
              {siteName2 != "" && (
                <NavDropdown.Item href="/dbadmin">Go to Dashboard</NavDropdown.Item>
              )}
                <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
              </NavDropdown>
              &nbsp;&nbsp;&nbsp;&nbsp;
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
                {/* {siteName2 != "" && (
                <Link
                    to={'/dbadmin'}
                    className="btn btn-dark"
                    >
                    Go to Dashboard(Admin)
                </Link>
                )} */}
                <br/><br/>
                <Link
                    to={'/users'}
                    className="btn btn-info"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                    </svg>
                    &nbsp; Users
                </Link>
                &nbsp;&nbsp;
                <AddSite />
                <br/><br/>
                <table className="table table-bordered">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Responsible</th>
                        <th scope="col">Edit & Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {siteName.map((siteName, index) => (
                    <tr key={index}>
                        <td>{siteName.name}</td>
                        <td>{siteName.address}</td>
                        <td>{siteName.responsible}</td>
                        <td>
                          <button
                          className="btn btn-danger ms-2"
                          onClick={(e) => handleDelete(siteName.name)}
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                          </svg>
                          </button>
                          &nbsp;&nbsp;
                          <Link
                          to={'#'}
                          className="btn btn-warning"
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
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
