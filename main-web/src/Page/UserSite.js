import React, { useEffect, useState } from "react";
import {  useParams } from 'react-router-dom';
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../components/SearchBar";
import AddSite from "../components/AddSite";

function UserSiteContent() {
  //Check Token API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name1 = localStorage.getItem("name");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,name1
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          //ไม่ต้องทำอะไร
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
      getDataUser();
  }, []);
 
  const {name} = useParams();

  const [user_site, setUserSite] = useState([]);
  async function getDataUser(){
      const getUserSiteData = await axios.get('http://localhost:3333/user_site')
      const dataLog = [];
      getUserSiteData.data.map((item)=>{
      if(name === item.username){
        dataLog.push(item)
      }   
    })
    setUserSite(dataLog);
    console.log(dataLog)
  };

    // Search bar
    const handleSearch = (searchTerm) => { 
      // Perform your search logic here and update the filtered data
      console.log(searchTerm.length);
      if (searchTerm.length > 0) {
       
        const filteredResults = user_site.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        console.log(filteredResults);
        setUserSite(filteredResults);
      } else {
          getDataUser();
      }
      console.log(searchTerm);
      };
      
      const handleDelete = async (id) => {
        try {
          alert("Delete Site : " + id + " Complete!");
          axios.delete("http://localhost:3333/deletesite/" + id);
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };

  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
        <Navbar.Brand href="/users">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
            <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
        </svg>
        &nbsp; Users List
        </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="vh-100 justify-content-center align-items-center">
        <div className="bg-white p-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Site List For : {name}</h2>
          </div>

          Filter : &nbsp;&nbsp; <SearchBar data={user_site} onSearch={handleSearch} />
          <br /><br />
          <AddSite />  
          <br /><br />
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Site</th>
                <th scope="col">Contact Customer</th>
                <th scope="col">Contract Period</th>
              </tr>
            </thead>
            <tbody>
            {user_site.map ((user_site,i) => (  
                <tr key={i}>
                    <td>{user_site.site}</td>
                    <td>{user_site.contact_name} ({user_site.contact_tel[0]}
                        {user_site.contact_tel[1]}
                        {user_site.contact_tel[2]}-
                        {user_site.contact_tel[3]}
                        {user_site.contact_tel[4]}
                        {user_site.contact_tel[5]}-
                        {user_site.contact_tel[6]}
                        {user_site.contact_tel[7]}
                        {user_site.contact_tel[8]}
                        {user_site.contact_tel[9]})</td>                        
                    <td>{user_site.start_period} / {user_site.end_period}</td>   
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function UserSite() {
  return <UserSiteContent />;
}
