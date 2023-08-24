import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddAPContent() {
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
const [model, setModel] = useState('');
const [role, setRole] = useState('');
const [maps, setMaps] = useState('');
const [config, setConfig] = useState('');
const navigate = useNavigate();

function handleSubmit(event) {        
    event.preventDefault();        
    axios.post('http://localhost:3333/addap', { role, maps,
    config, build_name, build_group, ipswitch, model, hostname})        
    .then(res => {            
        if(res.data.added){
            alert("Added Access Point Data Complete!")
            navigate('/accesspoint')    
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
        <Navbar.Brand href="/accesspoint">Back To Access Point List</Navbar.Brand>
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
            <h2>Add Access Point Data</h2>
        </div>              
        <div className='mb-4'>
            <label htmlFor='Select Site'>Site</label>
                <select class="form-control" onChange={e => (e.target.value)} disabled>
                    <option>Select Site</option>
                    <option>NKC</option>
                    <option>KKU</option>
                </select>
            </div>
            
            <div className='mb-4'>
            <label htmlFor=''>Role</label>
                <select class="form-control" onChange={e => setRole(e.target.value)}>
                    <option>Select AP Role</option>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                </select>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Map</label>
                <select class="form-control" onChange={e => setMaps(e.target.value)}>
                    <option>Select Map Link</option>
                    <option>[Link]</option>
                </select>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Config</label>
                <select class="form-control" onChange={e => setConfig(e.target.value)}>
                    <option>Select Config Link</option>
                    <option>[Link]</option>
                </select>

            <div className='mb-4'>
                <label htmlFor=''>Building Name</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => setBuildname(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Building Group</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => setBuildgroup(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Floor</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>IP Switch</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => setIpswitch(e.target.value)}/>
            </div>

            <div className='mb-4'>
            <label htmlFor='Select Model'>Model</label>
                <select class="form-control" onChange={e => setModel(e.target.value)}>
                    <option>Select AP Model</option>
                    <option>AirEngine5761-21</option>
                    <option>AirEngine6760R-51E</option>
                </select>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Serial AP</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>HostName</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => setHostname(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>AP Box</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Cable Name</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>VLAN</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Serial Number</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>MAC Address</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Status AP</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Lasted Update</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

            <div className='mb-4'>
                <label htmlFor=''>Note</label>
                <input type="text" placeholder='' className='form-control'
                onChange={e => (e.target.value)} disabled/>
            </div>

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

export default function AddAccessPoint() {
    return <AddAPContent />
}