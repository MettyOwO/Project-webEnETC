import React, { useEffect, useState } from "react";
import {  useParams } from 'react-router-dom';
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../components/SearchBar";
import AddResponsible from "../components/AddResponsible";

function ResponsibleContent() {
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
 
  const role = localStorage.getItem("role");
  const {site} = useParams();

  const [res_log, setResponsible] = useState([]);
  async function getDataUser(){
      const getResLogData = await axios.get('http://localhost:3333/user_site')
      const dataLog = [];
      getResLogData.data.map((item)=>{
      if(site === item.site){
        dataLog.push(item)
      }   
    })
    setResponsible(dataLog);
    console.log(dataLog)
  };

    // Search bar
    const handleSearch = (searchTerm) => { 
      // Perform your search logic here and update the filtered data
      console.log(searchTerm.length);
      if (searchTerm.length > 0) {
       
        const filteredResults = res_log.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        console.log(filteredResults);
        setResponsible(filteredResults);
      } else {
          getDataUser();
      }
      console.log(searchTerm);
      };
      
      const handleDelete = async (id) => {
        try {
          alert("Delete Responsible ID : " + id + " Complete!");
          axios.delete("http://localhost:3333/delete_res/" + id);
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
        {role === "Admin" && (
        <Navbar.Brand href="/home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
        </svg>
        &nbsp; Home
    </Navbar.Brand>
          )}
          {role === "User" && (
        <Navbar.Brand href="/home2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
        </svg>
        &nbsp; Home
    </Navbar.Brand>
          )}  
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
            <h2>Responsible : {site}</h2>
          </div>
          {role === "Admin" && (
            <div>
              Filter : &nbsp;&nbsp; <SearchBar data={res_log} onSearch={handleSearch} />
              <br /><br />
              <AddResponsible />
              <br /><br />
            </div>
          )}
          {role === "User" && (
            <div>
              Filter : &nbsp;&nbsp; <SearchBar data={res_log} onSearch={handleSearch} />
              <br /><br />
            </div>
          )}  
          
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Site</th>
                <th scope="col">Name</th>
                {role === "Admin" && (
                  <th scope="col">Delete Responsible</th>
                )}
              </tr>
            </thead>
            <tbody>
            {res_log.map ((res_log,i) => (  
                <tr key={i}>
                  <td>{res_log.site}</td>
                  <td>{res_log.username}</td>
                  {role === "Admin" && (
                  <td>
                  <button
                      className="btn btn-danger ms-2"
                      onClick={(e) => handleDelete(res_log.id)}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                      </svg>
                  </button>
                </td>
                  )}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Responsible() {
  return <ResponsibleContent />;
}
