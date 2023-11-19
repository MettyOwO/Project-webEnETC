import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function DCNKCContent() {
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

    //Access Point List API
    const [deviceclist, setDcList] = useState([]); 
    useEffect(()=> {
        axios.get('http://localhost:3333/deviceclist_nkc')        
        .then(res => setDcList(res.data))        
        .catch(err => console.log(err));    
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
                    <h2>Device Corrupted NKC</h2>
                </div><br/>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Site</th>
                            <th scope="col">Building Group</th>
                            <th scope="col">Building Name</th>
                            <th scope="col">IP Address</th>
                            <th scope="col">Hostname</th>
                            <th scope="col">Role</th>
                            <th scope="col">Replace With Serial Number</th>
                            <th scope="col">Detail Device Corrupted</th>
                            <th scope="col">DateTime Device Change</th>
                            <th scope="col">Maps</th>
                        </tr>
                    </thead>
                    <tbody>
                        { deviceclist.map ((deviceclist, i) => (
                            <tr key={i}>
                                <td>{deviceclist.Site}</td>
                                <td>{deviceclist.Buildgroup}</td>
                                <td>{deviceclist.Buildname}</td>
                                <td>{deviceclist.Ipaddress}</td>
                                <td>{deviceclist.Hostname}</td>
                                <td>{deviceclist.Role}</td>
                                <td>{deviceclist.Serialnumber}</td>
                                <td>{deviceclist.Details}</td>
                                <td>{deviceclist.Datatime1}</td>
                                <td><Link to="/maps" className="btn btn-info">Click</Link></td>
                            </tr>
                        ))}   
                    </tbody> 
                </table>
            </div>
        </div>
    </div>          
    );
}
    

export default function DeviceCorruptedNKC() {
    return <DCNKCContent />
}