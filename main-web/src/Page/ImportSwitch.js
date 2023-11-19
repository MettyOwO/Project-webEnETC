import React, { useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart } from "react-google-charts";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';

function ImportSwitchContent() {
    //Check Token API
    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch ('http://localhost:3333/authen', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+token
            },
        })   
        .then(response => response.json())
        .then(data => {
        if(data.status === 'ok'){
        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem('token')
            window.location = '/login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
    },[])

        //Log Out
        const handleLogout = (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location = '/login'
        }

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="#">...</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">          
            </Nav>
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>

    <h2 class="mb-3">Import Access Point Excel Data To Database</h2>
    <form action="/import-csv" method="post" enctype="multipart/form-data">
      <div class="mb-3">
        <input
          type="file"
          class="form-control"
          name="import-csv"
          accept="csv"
        />
      </div>
      <div>
        <button onclick="myFunction()" class="btn btn-dark" value="Store File">Store File</button>
      </div>
    </form>
  
        </div>          
      );
    }
    

export default function ImportSwitch() {
    return <ImportSwitchContent />
}