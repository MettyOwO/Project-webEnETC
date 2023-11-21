import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { CSVLink} from 'react-csv';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavDropdown from 'react-bootstrap/NavDropdown';

function APKKUContent() {
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
    const [aplist, setApList] = useState([]); 
    useEffect(()=> {
        axios.get('http://localhost:3333/aplist_kku')        
        .then(res => setApList(res.data))        
        .catch(err => console.log(err));    
    },[])

    //AP Delete Function
    const handleDelete = async (id) => {
        try {           
            alert("Delete Access Switch Data Complete!")
            axios.delete('http://localhost:3333/deleteap/'+id)
            window.location.reload();          
        }
        catch(err){            
            console.log(err);        
        }
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
            <Navbar.Brand href="/dbadmin">Back To Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
            
            <NavDropdown title="Access Point Datasheet" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://e.huawei.com/en/material/networking/campus-network/wlan/5d086921ffd04ae4b77cda33408f84c7" target="_blank">Type-Indoor (AirEngine5761-21)</NavDropdown.Item>
                <NavDropdown.Item href="https://e.huawei.com/en/material/networking/campus-network/wlan/11050655dd4d404f9aebeeeb8de4b832" target="_blank">Type-Outdoor (AirEngine6760R-51E)</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Access Point Model" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://e.huawei.com/en/products/wlan/indoor-access-points/airengine-5761-21" target="_blank">Type-Indoor (AirEngine5761-21)</NavDropdown.Item>
                <NavDropdown.Item href="https://e.huawei.com/en/products/wlan/outdoor-access-points/airengine-6760r-51-airengine-6760r-51e" target="_blank">Type-Outdoor (AirEngine6760R-51E)</NavDropdown.Item>
            </NavDropdown>

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
                    <h2>Access Point KKU List</h2>
                </div><br/>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Building Group</th>
                            <th scope="col">Building Name</th>
                            <th scope="col">IP Address</th>
                            <th scope="col">Hostname</th>
                            <th scope="col">Role</th>
                            <th scope="col">Map</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        { aplist.map ((aplist) => (
                            <tr key={aplist.ID}>
                                <td>{aplist.Buildgroup}</td>
                                <td>{aplist.Buildname}</td>
                                <td>{aplist.IPswitch}</td>
                                <td>{aplist.APname}</td>
                                <td>{aplist.Role}</td>
                                <td><Link to="/maps" className="btn btn-info">Click</Link></td>
                                <td><button className='btn btn-danger ms-2' onClick={ e => handleDelete(aplist.ID)}>Delete</button></td>
                            </tr>
                        ))}   
                    </tbody> 
                </table>
            </div>
        </div>
    </div>          
    );
}
    

export default function AccessPointKKU() {
    return <APKKUContent />
}