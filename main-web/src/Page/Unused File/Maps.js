import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

function MapsContent() {
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
        <div className='vh-100 justify-content-center align-items-center'>
            <div className='bg-white p-3'>            
                <div       
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                    <h2>Maps List for Access Point and Switch</h2>
                </div>                
            </div>
                <div className='bg-white p-3'>        
                <table class="table">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Building Name</th>
                            <th scope="col">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">คณะทันตะแพทย์</th>
                            <td><Link to= 'https://drive.google.com/drive/folders/1rBrNSXyOlyQMwaiyrh92azuQNScLHIjy' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">คณะวิทยาศาสตร์</th>
                            <td><Link to= 'https://drive.google.com/drive/folders/1TYNwBx__GvXTCzkTNAGJr1Gb6BD10ykV' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">คณะสัตว์แพทยศาสตร์</th>
                            <td><Link to= 'https://drive.google.com/drive/folders/1bxltxyDFdmqQ7RsLNNLM4q3yZbgff5by' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">คณะวิศวกรรมคอมพิวเตอร์</th>
                            <td><Link to= 'https://drive.google.com/drive/folders/12m-zjQhPyEz2c0pc_lEJ4s5ASDk8Bbhb' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">คณะวิศวกรรมเครื่องกล</th>
                            <td><Link to= 'https://drive.google.com/drive/folders/11vf2aINUfRXH40LfPcC-LP753msLKisW' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">คณะวิศวกรรมโยธา</th>
                            <td><Link to= 'https://drive.google.com/drive/folders/1EmKxH-Mc5J5tWQkn9Z_x3rPKQXYy2ZvV' className="btn btn-info" target="_blank">Click!</Link></td>
                        </tr>
                    </tbody>
                    </table>
                </div>    
        </div>        
    </div>          
      );
    }
    

export default function Maps() {
    return <MapsContent />
}