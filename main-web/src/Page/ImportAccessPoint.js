import React, { useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function ImportAccessPointContent() {
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
        .catch((err) => {
        console.log("Error:", err);
        });
    },[])
    
    const navigate = useNavigate();
    async function handleSubmit(e) {    
        const form = document.querySelector("form");
        const formData = new FormData(form);
        e.preventDefault();
        axios
          .post("http://localhost:3333/import-accesspoint-csv", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if(res.data.added){
                alert("Import CSV Data Complete!")
                navigate('/dbadmin') 
            }else{
                alert("Error! Please Try Again.")
            }   
          })
          .catch(error => console.log(error));
      }

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/dbadmin">Back To Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">          
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
            <br/>
            <div       
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
                <h2>Import Access Point Data From .CSV To Database</h2>
            </div> 
            <form 
            className="container mt-3 mb-3"
            //encType="multipart/form-data"
            //action="http://localhost:3333/import-accesspoint-csv" 
            //method="post"
            >
            <div className="mb-3">
                <input
                className="form-control"
                type="file"
                name="import-csv"
                accept="csv"
                />
            </div>
            <div 
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
                <button onClick={ handleSubmit} className="btn btn-dark">Store File</button>
            </div>
            </form>
        </div>          
      );
    }
    
export default function ImportAccessPoint() {
    return <ImportAccessPointContent />
}