import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function ReportAPContent() {
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

    //..
    const {id} = useParams();
    const [site, setSite] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [build_name, setBuildname] = useState('');
    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [role, setRole] = useState('');
    const [serial_number, setSR] = useState('');
    const [detail, setDetail] = useState('');
    useEffect(() => {
        axios.get('http://localhost:3333/aplistwithid/'+id)
        .then(res => {
            setSite(res.data[0].Site)
            setHostname(res.data[0].APname);
            setBuildname(res.data[0].Buildname);
            setBuildgroup(res.data[0].Buildgroup);
            setIpswitch(res.data[0].IPswitch)
        })
        .catch(err => console.log(err));
    },[])

    //...
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3333/addreport_ap/'+ id, {site, build_group, build_name,
        ipswitch, hostname, role, serial_number, detail}) 
        .then(res => {
            if(res.data.added){
                alert("Add Device Corrupted Data!")
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

    //UI
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
                <h2>Report Access Point Device Corrupted</h2>
            </div> 
     
                <div className='mb-4'>
                    <label htmlFor=''>Site</label>
                    <input type="text" placeholder='' className='form-control'
                    value={site} onChange={e => setSite(e.target.value)} disabled/>
                </div>
                
                <div className='mb-4'>
                    <label htmlFor=''>Building Group</label>
                    <input type="text" placeholder='' className='form-control'
                    value={build_group} onChange={e => setBuildgroup(e.target.value)} disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Building Name</label>
                    <input type="text" placeholder='' className='form-control'
                    value={build_name} onChange={e => setBuildname(e.target.value)} disabled/>
                </div>

                <div className='mb-4'>
                    <label>IP Address (IP Switch)</label>
                    <input type="text" className='form-control'
                    value={ipswitch} onChange={e => setIpswitch(e.target.value)} disabled/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Hostname</label>
                    <input type="text" placeholder='' className='form-control'
                    value={hostname} onChange={e => setHostname(e.target.value)} disabled/>
                </div>

                <div className='mb-4'>
                <label htmlFor=''>Role</label>
                <select class="form-control" onChange={e => setRole(e.target.value)}>
                    <option>Select Role Device</option>                  
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
                    <button className="btn btn-primary" onClick={ handleSubmit }>Add!</button>  
                </div>
                 
            </form>
        </div> 
        </div>
      );
    }
    
export default function ReportAP() {
    return <ReportAPContent />
}