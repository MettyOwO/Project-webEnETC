import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserAddAPContent() {
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
        getDataSite()
    },[])

    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [role, setRole] = useState("Select AP Role");
    const [site, setSite] = useState("Select Site");
    const [model, setModel] = useState("Select Model");
    const navigate = useNavigate();

    function handleSubmit(event) {        
        event.preventDefault();
        if (site != "Select Site" && hostname != '' 
            && ipswitch != '' && build_name != '' 
            && build_group != '' && role != "Select AP Role" && model != "Select Model") {      
            axios.
            post('http://localhost:3333/addap', {site, build_name, build_group, ipswitch, hostname, role, model})        
            .then(res => {            
                if(res.data.added){
                    alert("Add Access Point Data Complete!")
                    //navigate('/accesspoint')
                    navigate('/dbusers') 
                }else{
                    alert("Error! Please Try Again.")
                }       
            })
            .catch(err => console.log(err));
        }else{
            alert("Please Complete The Information!");
        }    
    }

    const [siteName,setSiteName] = useState([])
    async function getDataSite(){
        const getSiteName = await axios.get("http://localhost:3333/site_name")
        setSiteName(getSiteName.data)
    };
    
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
    <Navbar.Brand href='/dbusers'>Back To Dashboard</Navbar.Brand>
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
                <select className="form-control" 
                onChange={e => setSite(e.target.value)}
                >
                    <option>Select Site</option>
                    {siteName.map ((siteName,index) => (        
                        <option key={index}>{siteName.name}</option>           
                    ))}
                </select>
            </div>          
            
            <div className='mb-4'>
                <label>Building Group</label>
                <input type="text" 
                className='form-control' 
                required
                onChange={e => setBuildgroup(e.target.value)}
                />
            </div>

            <div className='mb-4'>
                <label>Building Name</label>
                <input type="text" 
                className='form-control' 
                required
                onChange={e => setBuildname(e.target.value)}
                />
            </div>

            <div className='mb-4'>
                <label>IP Switch</label>
                <input type="text" 
                className='form-control' 
                required
                onChange={e => setIpswitch(e.target.value)}
                />
            </div>

            <div className='mb-4'>
                <label>HostName</label>
                <input type="text" 
                className='form-control' 
                required
                onChange={e => setHostname(e.target.value)}
                />
            </div>
            
            <div className='mb-4'>
                <label htmlFor='Select Model'>Model</label>
                <select 
                    className="form-control" 
                    onChange={e => setModel(e.target.value)}>
                    <option>Select Model</option>                    
                    <option>AirEngine5761-21</option>
                    <option>AirEngine6760R-51E</option>
                </select>
            </div>
            
            <div className='mb-4'>
            <label>Role</label>
                <select className="form-control" 
                onChange={e => setRole(e.target.value)}
                >
                    <option>Select AP Role</option>
                    <option>Indoor</option>
                    <option>Outdoor</option>
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

export default function AddAccessPoint() {
    return <UserAddAPContent />
}