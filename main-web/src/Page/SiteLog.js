import React, { useEffect, useState } from "react";
import {  useParams } from 'react-router-dom';
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../components/SearchBar";

function SiteLogContent() {
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
 
  const {site} = useParams();

  const [sitelog, setSiteLog] = useState([]);
  async function getDataUser(){
      const getStieLogData = await axios.get('http://localhost:3333/site_log')
      const dataLog = [];
      getStieLogData.data.map((item)=>{
      if(site === item.site){
        dataLog.push(item)
      }   
    })
    setSiteLog(dataLog);
    console.log(dataLog)
  };

    // Search bar
    const handleSearch = (searchTerm) => { 
      // Perform your search logic here and update the filtered data
      console.log(searchTerm.length);
      if (searchTerm.length > 0) {
       
        const filteredResults = sitelog.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        console.log(filteredResults);
        setSiteLog(filteredResults);
      } else {
          getDataUser();
      }
      console.log(searchTerm);
      };  

  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
        <Navbar.Brand href="/home">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
            </svg>
            &nbsp; Home
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
            <h2>Site Log : {site}</h2>
          </div>

          Filter : &nbsp;&nbsp; <SearchBar data={sitelog} onSearch={handleSearch} />
          <br /><br />
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Employee ID</th>
                <th scope="col">Type</th>
                <th scope="col">Latest Date Viewed</th>
              </tr>
            </thead>
            <tbody>
            {sitelog.map ((sitelog,i) => (  
                <tr key={i}>
                  <td>{sitelog.username}</td>
                  <td>{sitelog.employeeid}</td>
                  <td>{sitelog.type}</td>
                  <td>{sitelog.date_time}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SiteLog() {
  return <SiteLogContent />;
}
