import React, { useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

function ConfigContent() {
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
            //ไม่ต้องทำอะไร
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
                <Navbar.Brand href="/dbadmin">Back To Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark-example" />
                <Navbar.Collapse id="navbar-dark-example">
                <Nav className="me-auto"></Nav>
                <Nav>
                    <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
            <div className='vh-100 justify-content-center align-items-center'>
            <div className='bg-white p-3'>            
                <div       
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                    <h2>Config for Switch</h2>
                </div>                
            </div>
                <div className='bg-white p-3'>        
                    <table class="table">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Switch Type</th>
                            <th scope="col">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Access</th>
                            <td><Link to= 'https://drive.google.com/drive/u/0/folders/1ZUgrwitvLEEXj-5o686yaNp2KZDHE-Nb' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">Distribute</th>
                            <td><Link to= 'https://drive.google.com/drive/u/0/folders/1tUrTnMi6EvohxFNmOok0DxRDO1hP6J7g' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                    </tbody>
                    </table>
                </div>    
            </div>
        </div>                 
        );
    }

export default function Config() {
    return <ConfigContent />
}