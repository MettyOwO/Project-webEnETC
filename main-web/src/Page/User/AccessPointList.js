import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { CSVLink} from 'react-csv';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavDropdown from 'react-bootstrap/NavDropdown';

function APContent() {
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
        axios.get('http://localhost:3333/aplist')        
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

    //Export Excel
    const [apdata, setApdata]= useState([]); 
    useEffect( ()=>{
       const getapdata= async ()=>{
         const apreq= await fetch("http://localhost:3333/aplist");
         const apres= await apreq.json();
         console.log(apres);
         setApdata(apres);
       }
    getapdata();
    },[]);

    //UI
    return (
        <div>     
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/dbusers'>Back To Dashboard</Navbar.Brand>
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
                    <h2>Access Point List</h2>
                </div> 

                <Link to="/addap2" className='btn btn-primary'>Add Data</Link>&nbsp;
                <Link to="http://localhost:3333/import-accesspoint" className='btn btn-success'>Import Excel Data (Beta)</Link>&nbsp;
                <CSVLink  data={ apdata } filename="AccessPoint"  className="btn btn-success">Export Excel Data</CSVLink><br/><br/>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Building Group</th>
                            <th scope="col">Building Name</th>
                            <th scope="col">IP Address</th>
                            <th scope="col">Hostname</th>
                            <th scope="col">Role</th>
                            <th scope="col">Map</th>
                            <th scope="col">Edit & Delete</th>
                            <th scope="col">Report Deivce</th>
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
                                <td><Link to="/maps2" className="btn btn-info">Click</Link></td>
                                <td><Link to= {`/updateap2/${aplist.ID}`} className="btn btn-warning">Edit</Link> &nbsp;
                                <button className='btn btn-danger ms-2' onClick={ e => handleDelete(aplist.ID)}>Delete</button>
                                </td>
                                <td><Link to={`/report_ap/${aplist.ID}`} className="btn btn-dark">Click</Link></td>
                            </tr>
                        ))}   
                    </tbody> 
                </table>
            </div>
        </div>
    </div>          
    );
}
    

export default function AccessPointList() {
    return <APContent />
}