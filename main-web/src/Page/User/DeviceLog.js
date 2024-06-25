import React, { useEffect, useState } from "react";
import {  useParams } from 'react-router-dom';
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

function DeviceLogContent() {
  //Check Token API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const site1 = localStorage.getItem("site");
    const name1 = localStorage.getItem("name");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, email, site1, name1
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
        } else {
          alert("Authen Failed. Please Try Login Again!");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("site");
          localStorage.removeItem("name");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
      getData();
  }, []);

  const {id} = useParams();
  const [list, setList] = useState([]);
  async function getData() {
    const getData1 = await axios.get('http://localhost:3333/device_log/'+id)
    const setData = [];
    getData1.data.map((item) => {
      setData.push(item);
    });  
    setList(setData);
  }

  //UI
  return (
    <div>
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/dbusers">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-back" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
          </svg>
          &nbsp; Dashboard
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
            <h2>Old Device Log ID : {id}</h2>
          </div>
          <br /><br />

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Site</th>
                <th scope="col">Building Group</th>
                <th scope="col">Building Name</th>
                <th scope="col">Hostname</th>
                <th scope="col">IP</th>
                <th scope="col">Model</th>
                <th scope="col">Role</th>
                <th scope="col">Serial No.</th>
                <th scope="col">Mac Address</th>
                <th scope="col">Total Num</th>
                <th scope="col">Latest by</th>
              </tr>
            </thead>
            <tbody>
            {list.map((list, index) => (
                <tr key={index}>
                  <td>{list.site}</td>
                  <td>{list.old_build_group}</td>
                  <td>{list.old_build_name}</td>
                  <td>{list.old_hostname}</td>
                  <td>{list.old_ip}</td>
                  <td>{list.old_model}</td> 
                  <td>{list.old_role}</td>
                  <td>{list.old_serial}</td>
                  <td>{list.old_mac}</td>
                  <td>{list.num_device_change}</td> 
                  <td>{list.report_by}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DeviceLog() {
  return <DeviceLogContent />;
}
