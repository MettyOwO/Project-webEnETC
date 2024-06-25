import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import { CSVLink} from 'react-csv';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';

function SwitchKKUContent() {
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
            window.location = '/Login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
    },[])

    //SW API
    const [swlist, setSwList] = useState([]);   
    useEffect(() => {
        fetch("http://localhost:3333/switchlist_kku")
          .then(res => res.json())
          .then(
            (result) => {
              setSwList(result);
            }
          )
      }, [])

    //ฟังก์ชั่น Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/Login'
    }

    //SW Delete Function
    const handleDelete = async (id) => {
        try {           
            alert("Delete Switch Data Complete!")
            axios.delete('http://localhost:3333/deletesw/'+id)
            window.location.reload();          
        }
        catch(err){            
            console.log(err);        
        }
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
            <NavDropdown title="Switch Datasheet" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://e.huawei.com/en/material/networking/a7d76a8a16614cefb9943336bb224d69" target="_blank">Type-Access (S5735-L24P4X-A1)</NavDropdown.Item>
                <NavDropdown.Item href="https://e.huawei.com/en/material/networking/campus-network/campusswitch/767ee329a806443b8d874ef052c1384d" target="_blank">Type-Distribute (S5736-S24S4XC)</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Switch Model" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://support.huawei.com/enterprise/en/doc/EDOC1000013597/9399f949/s5735-l24p4x-a1" target="_blank">Type-Access (S5735-L24P4X-A1)</NavDropdown.Item>
                <NavDropdown.Item href="https://support.huawei.com/enterprise/en/doc/EDOC1000013597/a3e92592/s5736-s24s4xc" target="_blank">Type-Distribute (S5736-S24S4XC)</NavDropdown.Item>
            </NavDropdown>
            </Nav>
            </Navbar.Collapse>
            <Navbar.Brand onClick={ handleLogout }>Log-Out</Navbar.Brand>
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
                    <h2>Switch KKU List</h2>
                </div><br/>
                <table class="table table-bordered">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">Building Group</th>
                            <th scope="col">Building Name</th>
                            <th scope="col">Hostname</th>
                            <th scope="col">IP Address</th>
                            <th scope="col">Role</th>
                            <th scope="col">Map</th>
                            <th scope="col">Config</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    {swlist.map ((swlist) => (
                        <tbody>
                            <tr key={swlist.ID}>
                                <td>{swlist.buildgroup}</td>
                                <td>{swlist.buildname}</td>
                                <td>{swlist.hostname}</td>
                                <td>{swlist.ip}</td>
                                <td>{swlist.role}</td>
                                <td><Link to="/maps" className="btn btn-info">Click</Link></td>
                                <td><Link to="/config" className="btn btn-info">Click</Link></td>
                                <td>
                                <button className='btn btn-danger ms-2' onClick={ e => handleDelete(swlist.ID)}>Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    ))}    
                 </table>
            </div>                                              
        </div>                                        
    </div>          
    );
}
    

export default function SwitchKKU() {
    return <SwitchKKUContent />
}