import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddSWContent() {
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

const [hostname, setHostname] = useState('');
const [ipswitch, setIpswitch] = useState('');
const [build_name, setBuildname] = useState('');
const [build_group, setBuildgroup] = useState('');
const [role, setRole] = useState('');
const navigate = useNavigate();

function handleSubmit(event) {        
    event.preventDefault();        
    axios.post('http://localhost:3333/addsw', {build_name, build_group, ipswitch, hostname, role})        
    .then(res => {            
        if(res.data.added){
            alert("Add Switch Data Complete!")
            navigate('/switch')    
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
        <Navbar.Brand href="/switch">Back To Switch List</Navbar.Brand>
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
            <h2>Add Switch Data</h2>
            </div>              
            
            <div className='mb-4'>
            <label htmlFor='Select Site'>Site</label>
                <select class="form-control" disabled>
                    <option>Select Site</option>
                    <option>NKC</option>
                    <option>KKU</option>
                </select>
            </div>          
            <div className='mb-4'>
                <label>Building Group</label>
                <input type="text" className='form-control'
                onChange={e => setBuildgroup(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>Building Name</label>
                <input type="text" className='form-control'
                onChange={e => setBuildname(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>IP Address</label>
                <input type="text" className='form-control'
                onChange={e => setIpswitch(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>HostName</label>
                <input type="text" className='form-control'
                onChange={e => setHostname(e.target.value)}/>
            </div>
            <div className='mb-4'>
            <label>Role</label>
                <select class="form-control" onChange={e => setRole(e.target.value)}>
                    <option>Select SW Role</option>
                    <option>Access</option>
                    <option>Distribute</option>
                </select>
            </div>
            <div 
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
            <button className="btn btn-primary" onClick={ handleSubmit }>Add Data</button>   
        </div>
        </form>
        </div> 
    </div>
)}

export default function AddSwitch() {
    return <AddSWContent />
}