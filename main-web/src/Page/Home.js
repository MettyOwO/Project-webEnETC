import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddSite from "../components/AddSite";
import NavDropdown from "react-bootstrap/NavDropdown";

function HomeContent() {
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

  // const navigate = useNavigate();

  //Log Out
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location = "/login";
  };

  const username1 = localStorage.getItem("name");

  const [user_name, setUserList] = useState([]);
  const [user_type, setUserType] = useState([]);
  const [user_employeeid, setUserEmployeeID] = useState([]);

  async function getDataUser(){
      const getUser = await axios.get('http://localhost:3333/users')
      const dataUser = [];
      const dataUser2 = [];
      const dataUser3 = [];
      getUser.data.map((item)=>{
      if(username1 === item.name){
        dataUser.push(item.name)
      }
      if(username1 === item.name){
        dataUser2.push(item.type)
      }   
      if(username1 === item.name){
        dataUser3.push(item.employeeid)
      }      
    })
    setUserList(dataUser);
    setUserType(dataUser2);
    setUserEmployeeID(dataUser3);
  };

  const [siteName,setSiteName] = useState([])
  async function getData() {
    const getDataSite = await axios.get("http://localhost:3333/site2")
    const dataSite = []
    getDataSite.data.map((item)=>{    
        dataSite.push(item)
    })
    setSiteName(dataSite)
  }
  useEffect(() => {
    getData();
    getDataUser();
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

  const handleGo = async (name) => { 
    try {
      axios.post('http://localhost:3333/add_sitelog', {name, user_name , user_type, user_employeeid})
      window.location = `/dbadmin/${name}`
    } catch (err) {
      console.log(err);
    }
  };
        
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
              {/* {siteName != "" && (
                <NavDropdown.Item href={`/dbadmin/${'allsite'}`}>Go to Dashboard</NavDropdown.Item>
              )} */}
                <NavDropdown.Item onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                    <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                  </svg>
                  &nbsp; Log Out
                </NavDropdown.Item>
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
                <br/><br/>
                <Link
                    to={'/users'}
                    className="btn btn-info"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                    </svg>
                    &nbsp; Staff
                </Link>
                &nbsp;&nbsp;
                <AddSite />            
                <br/><br/>
                <table className="table table-bordered">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Contact Customer</th>
                        <th scope="col">Contract Period</th>
                        <th scope="col">Log</th>
                        <th scope="col">Responsible</th>
                        <th scope="col">View</th>
                        <th scope="col">Edit & Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {siteName.map((siteName, index) => (
                    <tr key={index}>
                        <td>{siteName.name}</td>
                        <td>{siteName.contact_name} ({siteName.contact_tel[0]}
                        {siteName.contact_tel[1]}
                        {siteName.contact_tel[2]}-
                        {siteName.contact_tel[3]}
                        {siteName.contact_tel[4]}
                        {siteName.contact_tel[5]}-
                        {siteName.contact_tel[6]}
                        {siteName.contact_tel[7]}
                        {siteName.contact_tel[8]}
                        {siteName.contact_tel[9]})</td>                        
                        <td>{siteName.start_period} / {siteName.end_period}</td>    
                        
                        <td>
                        <Link
                        to={`/site_log/${siteName.name}`}
                        className="btn btn-info"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                          <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/>
                        </svg>
                        </Link>
                        </td>

                        <td>
                        <Link
                        to={`/responsible_site/${siteName.name}`}
                        className="btn btn-dark"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                          <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/>
                        </svg>
                        </Link>
                        </td>
                        
                        <td>
                        <Link
                        // to={`/dbadmin/${siteName.name}`}
                        onClick={(e) => handleGo(siteName.name)}
                        className="btn btn-success"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
                          <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1"/>
                        </svg>
                        </Link>
                        </td>

                        <td>
                          <button
                          className="btn btn-danger ms-2"
                          onClick={(e) => handleDelete(siteName.name)}
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                          </svg>
                          </button>
                          &nbsp;&nbsp;
                          <Link
                          to={`/site/${siteName.ID}`}
                          className="btn btn-warning"
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
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
