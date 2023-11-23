import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from "react-router-dom";
import AddUrl from "../AddUrl";

function UserDCContent() {
    //Check Token API
    const location = useLocation();
    const navigate = useNavigate();
    const [paramSite,setParamSite] = useState(location.state.site) 
    const [deviceclist, setDcList] = useState([]); 
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const site1 = localStorage.getItem("site");
        fetch("http://localhost:3333/authen", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, email, site1
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "ok") {
            } else {
              alert("Authen Failed. Please Try Login Again!");
              localStorage.removeItem("token");
              localStorage.removeItem("email");
              localStorage.removeItem("site");
              window.location = "/login";
            }
          })
          .catch((error) => {
            console.log("Error:", error);
          });
          getDataDC()
      }, []);
    
    async function getDataDC(){
        const getDc = await axios.get('http://localhost:3333/deviceclist')   
        const siteLocation = localStorage.getItem("site");
        const dataSite = []
        //console.log(getDc.data);

        getDc.data.map((item)=>{
            console.log(siteLocation);
            console.log( item.Site);
            console.log(siteLocation === item.Site);
              if( siteLocation === item.Site){
                  if(paramSite === item.Site ){
                  dataSite.push(item)
              }else if(paramSite === 'DCList'){
                  dataSite.push(item)   
              }
              }
              
          })
        console.log(dataSite);
        setDcList(dataSite)

    }

    //Delete Function
    const handleDelete = async (id) => {
        try {           
            alert("Delete Device Corrupted ID : " + (id) + " Complete!")
            axios.delete('http://localhost:3333/deletedc/'+id)
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
            <Navbar.Brand href="/dbusers">Back To Dashboard</Navbar.Brand>
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
                    {paramSite != "DCList" && <>
                    <h2>Switch {paramSite}</h2>
                    </>}
                    {paramSite === "DCList" && <>
                    <h2>Device Corrupted List</h2>
                    </>}
                    
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
                            <th scope="col">Config</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceclist.map ((deviceclist, i) => (
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
                                {deviceclist.urlmap && <>
                                    <td><Link to={deviceclist.urlmap} className="btn btn-info" target="_blank">Click</Link></td>
                                </>}
                                {!deviceclist.urlmap && <>
                                    <td><AddUrl id={deviceclist.ID} status="DC"/></td>
                                </>}
                                {deviceclist.urlconfig && <>
                                    <td><Link to={deviceclist.urlconfig} className="btn btn-info" target="_blank">Click</Link></td>
                                </>}
                                {!deviceclist.urlconfig && <>
                                    <td><AddUrl id={deviceclist.ID} status="DCSWConfig"/></td>
                                </>}
                                <td><button className='btn btn-danger ms-2' onClick={ e => handleDelete(deviceclist.ID)}>Delete</button></td>    
                            </tr>
                        ))}   
                    </tbody> 
                </table>
            </div>
        </div>
    </div>          
    );
}
    

export default function DeviceCorrupted() {
    return <UserDCContent />
}