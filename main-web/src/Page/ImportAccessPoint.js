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

    const navigate = useNavigate();
    const [filename, setFileName] = useState('');

    const handleSubmit = (event) => {       
        event.preventDefault();
        axios
        .post('http://localhost:3333/import-accesspoint-csv', {filename})   
        .then(res => {            
            if(res.data.added){
                alert("Add Complete!")
                navigate('/dbadmin') 
            }else{
                alert("Error!")
            }
        })
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
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
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
                <h2>Import Access Point Excel Data To Database</h2>
            </div> 
            <form 
            className="container mt-3 mb-3"
            encType="multipart/form-data"
            action="http://localhost:3333/import-accesspoint-csv" 
            method="post">
            <div className="mb-3">
                <input
                type="file"
                className="form-control"
                name="import-csv"
                accept="csv"
                onChange={e => setFileName(e.target.value)}
                />
            </div>
            <div 
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
                <button onClick={ handleSubmit } className="btn btn-dark">Store File</button>
            </div>
            </form>
        </div>          
      );
    }
    
export default function ImportAccessPoint() {
    return <ImportAccessPointContent />
}