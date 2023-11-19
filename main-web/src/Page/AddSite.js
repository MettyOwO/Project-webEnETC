import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddSiteContent() {
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

    const [type, setType] = useState('');
    const [sitename, setSiteName] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {        
        event.preventDefault();        
        axios.post('http://localhost:3333/addsitedevice', {type, sitename})        
        .then(res => {            
            if(res.data.added){
                alert("Add Site Device Complete!")
                navigate('/dbadmin')    
            }else{
                alert("Error! Please Try Again.")
            }       
        })
        .catch(err => console.log(err));    
    }

    //Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/login'
    }

    return (
    <div>
    <Navbar variant="dark" bg="dark" expand="lg">
    <Container fluid>
        <Navbar.Brand href="/dbadmin">Back To Dashbaord</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
        <Nav className="me-auto"></Nav>
        <Nav>
            <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
        </Nav>
        </Navbar.Collapse>
    </Container>
    </Navbar>

        <div>
            <form className="container mt-3 mb-3" onSubmit={handleSubmit}>
            <div       
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
            <h2>Add New Site For Device</h2>
            </div>              
                      
            <div className='mb-4'>
            <label htmlFor='Select DeviceType'>Device Type</label>
                <select className="form-control" onChange={e => setType(e.target.value)}>
                    <option>Select Device Type</option>
                    <option>AP</option>
                    <option>SW</option>
                    <option>DC</option>
                </select>
            </div>   

            <div className='mb-4'>
                <label>Site Name</label>
                <input type="text" className='form-control'
                onChange={e => setSiteName(e.target.value)}/>
            </div>

            <div 
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
            <button className="btn btn-primary" onClick={ handleSubmit }>Add Site</button>   
        </div>
        </form>
        </div> 
    </div>
)}

export default function AddSite() {
    return <AddSiteContent />
}