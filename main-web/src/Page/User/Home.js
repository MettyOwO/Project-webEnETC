import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate, useLocation, useParams} from "react-router-dom";
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
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, name1, email,
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
    window.location = "/login";
  };

  // const handleGo = async (name) => { 
  //   try {
  //     axios.post('http://localhost:3333/add_sitelog', {name, user_name , user_type, user_employeeid})
  //     window.location = `/dbadmin/${name}`
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
   
  const username1 = localStorage.getItem("name");
  const [UserSite,setUserSite] = useState([])
  async function getData() {
    const getUserSite = await axios.get("http://localhost:3333/user_site")
    const dataUserSite = []
    getUserSite.data.map((item)=>{    
      if(username1 === item.username){
        dataUserSite.push(item)
      }
    })
    setUserSite(dataUserSite)
  }

  
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

const handleGo = async (site) => { 
  try {
    axios.post('http://localhost:3333/add_sitelog2', {site, user_name , user_type, user_employeeid})
    localStorage.setItem("site", site);
    window.location = `/dbusers`
    // window.location = `/dbusers/${site}`
  } catch (err) {
    console.log(err);
  }
};

  // console.log(UserData)
  useEffect(() => {
    getData();
    getDataUser();
  }, []);

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
              <NavDropdown.Item onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                    <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                  </svg>
                  &nbsp; Log Out
                </NavDropdown.Item>
                {/* <NavDropdown.Item href={`/update_profile/${Id}`}>Edit Profile</NavDropdown.Item> */}
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
                        <th scope="col">Site</th>
                        <th scope="col">Contact Customer</th>
                        <th scope="col">Contract Period</th>
                        <th scope="col">Responsible</th>
                        <th scope="col">View</th>
                    </tr>
                    </thead>
                    <tbody>
                    {UserSite.map((item, index) => (
                    <tr key={index}>
                        <td>{item.site}</td>                 
                        <td>{item.contact_name} ({item.contact_tel[0]}
                        {item.contact_tel[1]}
                        {item.contact_tel[2]}-
                        {item.contact_tel[3]}
                        {item.contact_tel[4]}
                        {item.contact_tel[5]}-
                        {item.contact_tel[6]}
                        {item.contact_tel[7]}
                        {item.contact_tel[8]}
                        {item.contact_tel[9]})</td>
                        <td>{item.start_period} / {item.end_period}</td>   
                        <td>
                          <Link
                          to={`/responsible_site/${item.site}`}
                          className="btn btn-info"
                          >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                          <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/>
                        </svg>
                        </Link>
                        </td>                      
                         <td>
                          <Link
                          onClick={(e) => handleGo(item.site)}
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
