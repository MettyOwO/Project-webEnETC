import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditSWContent() {
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

    //Access Point List With AP_ID API
    const {id} = useParams();
    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [model, setModel] = useState('');
    const [role, setRole] = useState('');
    useEffect(() => {
        axios.get('http://localhost:3333/switchlistwithid/'+id)
        .then(res => {
            setHostname(res.data[0].hostname);
            setIpswitch(res.data[0].ip);
            setBuildname(res.data[0].buildname);
            setBuildgroup(res.data[0].buildgroup);
            setModel(res.data[0].model);
            setRole(res.data[0].role);
        })
        .catch(err => console.log(err));
    },[])

    //Update AP API
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:3333/updatesw/'+id, {role, build_name, 
        build_group, ipswitch, model, hostname}) 
        .then(res => {
            if(res.data.updated){
                alert("Update Switch Data Complete!")
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

    //UI
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
                <h2>Edit Switch Data</h2>
            </div> 

                <div className='mb-4'>
                    <label htmlFor=''>HostName</label>
                    <input type="text" placeholder='' className='form-control'
                    value={hostname} onChange={e => setHostname(e.target.value)}/>
                </div>
 
                <div className='mb-4'>
                    <label htmlFor=''>IP Address</label>
                    <input type="text" placeholder='' className='form-control'
                    value={ipswitch} onChange={e => setIpswitch(e.target.value)}/>
                </div>
                
                <div className='mb-4'>
                    <label htmlFor=''>Building Name</label>
                    <input type="text" placeholder='' className='form-control'
                    value={build_name} onChange={e => setBuildname(e.target.value)}/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Building Group</label>
                    <input type="text" placeholder='' className='form-control'
                    value={build_group} onChange={e => setBuildgroup(e.target.value)}/>
                </div>

                <div className='mb-4'>
                <label htmlFor='Select Model'>Model</label>
                <select class="form-control" value={model} onChange={e => setModel(e.target.value)}>
                    <option>S5735-L24P4X-A1</option>
                    <option>S5736-S24S4XC</option>
                </select>
                </div>

                <div className='mb-4'>
                <label htmlFor=''>Role</label>
                <select class="form-control" value={role} onChange={e => setRole(e.target.value)}>
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
                    <button className="btn btn-primary" onClick={ handleSubmit }>Update Data</button>  
                </div>
                 
            </form>
        </div> 
        </div>
      );
    }
    
export default function EditSwitch() {
    return <EditSWContent />
}