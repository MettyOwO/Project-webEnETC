import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddDeviceCorruptedContent() {
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
const [ipaddress, setIpAddress] = useState('');
const [build_name, setBuildname] = useState('');
const [build_group, setBuildgroup] = useState('');
const [role, setRole] = useState('');
const [serial_number, setSR] = useState('');
const [detail, setDetail] = useState('');
const [site, setSite] = useState('');
const navigate = useNavigate();

function handleSubmit(event) {        
    event.preventDefault();        
    axios.post('http://localhost:3333/adddc', {site, build_group, build_name, ipaddress, 
    hostname, role, serial_number, detail})        
    .then(res => {            
        if(res.data.added){
            alert("Add Device Corrupted Data Complete!")
            navigate('/deviceclist')    
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
        <Navbar.Brand href="/deviceclist">Back To Device Corrupted List</Navbar.Brand>
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
            <h2>Add Device Corrupted Data</h2>
            </div>              
            
            <div className='mb-4'>
            <label htmlFor='Select Site'>Site</label>
                <select class="form-control" onChange={e => setSite(e.target.value)}>
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
                onChange={e => setIpAddress(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>Hostname</label>
                <input type="text" className='form-control'
                onChange={e => setHostname(e.target.value)}/>
            </div>
            
            <div className='mb-4'>
            <label>Role</label>
                <select class="form-control" onChange={e => setRole(e.target.value)}>
                    <option>Select Device Role</option>
                    <option>AP-Indoor</option>
                    <option>AP-Outdoor</option>
                    <option>SW-Access</option>
                    <option>SW-Distribute</option>
                </select>
            </div>

            <div className='mb-4'>
                <label>Replace With Serial Number</label>
                <input type="text" className='form-control'
                onChange={e => setSR(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>Detail Device Corrupted</label>
                <input type="text" className='form-control'
                onChange={e => setDetail(e.target.value)}/>
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

export default function AddDeviceCorrupted() {
    return <AddDeviceCorruptedContent />
}